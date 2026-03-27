<template>
  <surveyTop />
  <!-- <div class="py-4 container-fluid"> -->
  <!-- <sidebar /> -->
  <sidebar @select-support="loadSupportDetail" />
  <div class="row">
    <!-- <div class="col-12">
      <surveyCard @submit-survey="surveyInfo" />
      자식 컴포넌트에서 surveyInfo 함수 가져와서 데이터 받음
      !-- <surveyAnswer /> -->
    <!-- </div> -->
    <div class="col-12">
      <surveyCard
        :selected-support="selectedSupport"
        @submit-survey="surveyInfo"
      />
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup>
import surveyCard from "./components/surveyCard.vue"; //조사지 카드 컴포넌트 가져옴
import Sidebar from "../examples/Sidenav/SidenavList.vue"; //사이드바 컴포넌트 가져옴
import surveyTop from "./components/surveyHeader.vue";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router"; //페이지 이동(라우팅) 위해 사용
import axios from "axios";

const router = useRouter(); //router 인스턴스 생성

// --- [추가] 선택된 대상자 정보를 담을 반응형 변수 ---
const selectedSupport = ref(null);

// --- [추가] 사이드바에서 선택한 ID로 상세 정보를 가져오는 함수 ---
const loadSupportDetail = async (supportId) => {
  try {
    // 우리가 만든 라우터 주소로 GET 요청
    const response = await axios.get(
      `http://localhost:3000/support/${supportId}`,
    );
    if (response.data) {
      selectedSupport.value = response.data; // 받아온 데이터를 저장 -> surveyCard로 전달됨
      console.log("선택된 대상자 상세 정보:", selectedSupport.value);
    }
  } catch (err) {
    console.error("대상자 정보를 불러오는데 실패했습니다.", err);
  }
};

////조사지 등록 함수
const info = reactive({
  //서버로 보낼 설문 데이터 객체
  J_ID: "",
  Ver_Id: "",
  G_UserId: "",
  support_id: "",
  result: null,
  reason: null,
  created_at: null,
  updated_at: null,
});

const isPrinted = ref(false);
//디비에 등록하려고 하는 데이터가 출력이 되었는지 묻는 코드고, 기본값은 출력안됐는 의미

//자식 컴포넌트(surveyCard)가 보낸 데이터를 받기 위해 payload 파라미터 추가
const surveyInfo = async (payload) => {
  console.log("자식으로부터 받은 데이터:", payload);
  // 0. 전달받은 데이터를 전송 객체에 할당
  info.J_ID = payload.extraInputs.J_ID;
  info.Ver_Id = payload.Ver_Id || "현재사용중Ver";
  info.G_UserId = payload.extraInputs.G_UserId;
  // --- [수정] 만약 선택된 대상자가 있다면 그 ID를 우선적으로 사용 ---
  info.support_id =
    selectedSupport.value?.support_id || payload.support_id || "";

  info.result = payload.extraInputs.result?.trim() || null; // 우선순위 저장 (조사지 첫 등록건이라 우선순위 없음)
  info.reason = payload.extraInputs.reason || null; //반려사유 저장 (조사지 첫 등록건이라 반려사유 없음)
  info.created_at = new Date(); //현재 시간 저장
  info.updated_at = new Date();

  let data = {
    //서버로 보낼 최종 데이터 객체 생성 => reactive에서 값 꺼내서 새 객체로 구성
    J_ID: info.J_ID,
    Ver_Id: info.Ver_Id,
    G_UserId: info.G_UserId,
    support_id: info.support_id,
    result: null,
    reason: null,
    created_at: info.created_at,
    updated_at: info.updated_at,
    answers: payload.answers,
  };

  // data.answers = payload.answers; //surveyCard에 있는 answers 코드 안에 있는 예/아니오 데이터 가져옴

  try {
    let response = await fetch(`http://localhost:3000/survey/user`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    let result = await response.json();
    console.log(result);

    if (result && result.status == "success") {
      //서버가 성공 응답했는지 체크
      alert("정상적으로 등록되었습니다.");
      router.push({ name: "userMain", params: { no: result.J_ID } });
      //여기서 등록 버튼을 클릭했을때 정상적으로 데이터가 넘어가면 일반이용자 조사지 메인페이지로 넘어감
      console.log(`등록되었습니다. 조사지번호 : ${result.J_ID}`);
    } else {
      isPrinted.value = true;
      alert("등록에 실패했습니다.");
    }
  } catch (err) {
    console.error("통신 에러:", err);
    alert("서버 연결에 실패했습니다.");
  }
};

//조사지 답변 함수
// const answer = reactive({
//   J_ID: "",
//   Ver_Id: "",
//   G_UserId: "",
//   support_id: "",
//   result: null,
//   reason: null,
//   created_at: null,
//   updated_at: null,
// });

// const sPrinted = ref(false);

// const surveyResponse = async (payload) => {
//   console.log("자식으로부터 받은 데이터:", payload);
// };

// answer.result = JSON.stringify(payload.answer);

// answer.res
</script>
