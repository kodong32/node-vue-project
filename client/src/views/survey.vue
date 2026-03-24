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
import { ref, reactive } from "vue";
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
</script>
