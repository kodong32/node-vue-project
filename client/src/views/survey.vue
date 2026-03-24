<template>
  <div class="py-4 container-fluid">
    <sidebar />
    <div class="row">
      <div class="col-12">
        <survey-table @submit-survey="surveyInfo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import surveyTable from "./components/surveyCard.vue";
import Sidebar from "../examples/Sidenav/SidenavList.vue";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router"; //👉 페이지 이동(라우팅) 위해 사용

const router = useRouter(); //👉 router 객체 생성 → router.push() 사용 가능

const info = reactive({
  //👉 서버로 보낼 설문 데이터 객체
  J_ID: "",
  Ver_Id: "",
  G_UserId: "",
  support_id: "",
  result: null,
  reason: null,
  created_at: null,
  updated_at: null,
});

const isPrinted = ref(false); //👉 실패 여부 표시용 상태값

// [수정] 자식으로부터 데이터를 받기 위해 payload 파라미터 추가
const surveyInfo = async (payload) => {
  console.log("자식으로부터 받은 데이터:", payload);

  // 0. 전달받은 데이터를 전송 객체에 할당
  info.result = JSON.stringify(payload.answers);
  //👉 우선순위 결과 저장 👉 배열/객체 → 문자열로 변환해서 서버 전송
  info.reason = payload.extraInputs.reason; //👉 반려사유 저장
  info.created_at = new Date(); //👉 현재 시간 저장

  let data = {
    //👉 서버로 보낼 최종 데이터 객체 생성 👉 reactive에서 값 꺼내서 새 객체로 구성
    //불필요한 반응성 제거 + API 전송용 데이터 정리
    J_ID: info.J_ID,
    Ver_Id: info.Ver_Id,
    G_UserId: info.G_UserId,
    support_id: info.support_id,
    result: info.result,
    reason: info.reason,
    created_at: info.created_at,
    updated_at: info.updated_at,
  };

  data.answers = [
    { question_id: 1, answer: "예" },
    { question_id: 2, answer: "아니오" },
  ];

  try {
    let response = await fetch(`http://localhost:3000/survey/user/survey`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    let result = await response.json();

    if (result && result.status == "success") {
      //👉 서버가 성공 응답했는지 체크
      alert("정상적으로 등록되었습니다.");
      router.push({ name: "userSurveyAdd", params: { no: result.J_ID } });
      console.log(`등록 완료 회원번호 : ${result.J_ID}`);
    } else {
      isPrinted.value = true; //👉 실패 상태 ON
      alert("등록에 실패했습니다.");
    }
  } catch (err) {
    console.error("통신 에러:", err);
    alert("서버 연결에 실패했습니다.");
  }
};

const allSections = ref([]); // 문항 데이터
const answers = ref([]); // 선택된 답변
const extraInputs = ref({}); // 추가 입력
const extraRequest = ref(""); // 추가 요청사항

onMounted(async () => {
  try {
    const J_ID = "SUV0000"; // 조회할 조사지 ID
    const response = await fetch(
      `http://localhost:3000/survey/getQuestionsByJID/${J_ID}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawQuestions = await response.json();
    // ✅ 수정: rawQuestions 선언 후 console.log 사용

    console.log("DB에서 내려온 데이터:", rawQuestions); // ✅ 수정: 선언 후 로그 출력

    // DB에서 내려온 raw 데이터를 Vue template 구조에 맞게 변환
    const sectionsMap = {};

    rawQuestions.forEach((q) => {
      // section 구분
      if (!sectionsMap[q.titleCode]) {
        sectionsMap[q.titleCode] = { title: q.titleCode, subs: [] };
      }
      const section = sectionsMap[q.titleCode];

      // subTitle 별로 sub 생성
      let sub = section.subs.find((s) => s.subTitle === q.subTitle);
      if (!sub) {
        sub = {
          subTitle: q.subTitle,
          description: q.description || "",
          questions: [],
        };
        section.subs.push(sub);
      }

      sub.questions.push({
        text: q.question_text,
        question_id: q.question_id,
        hasExtraInput: false, // 필요 시 DB 컬럼 추가 후 true/false 처리
      });
    });

    allSections.value = Object.values(sectionsMap);

    // 답변/추가 입력 초기값
    answers.value = [];
    extraInputs.value = {};
    extraRequest.value = "";

    console.log("뷰용 구조로 변환한 데이터:", allSections.value);
  } catch (err) {
    console.error("조사항목 불러오기 실패:", err);
  }
});
</script>
