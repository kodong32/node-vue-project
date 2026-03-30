<template>
  <surveyTop />
  <sidebar @select-support="loadSupportDetail" />
  <div class="row">
    <surveyAnswer />
    <div class="col-12">
      <SurveyCard
        :selectedSupport="selectedSupport"
        @submit-survey="surveyInfo"
      />
    </div>
  </div>
</template>

<script setup>
import SurveyCard from "./components/surveyCard.vue";
import Sidebar from "../examples/Sidenav/SidenavList.vue";
import surveyTop from "./components/surveyHeader.vue";
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const selectedSupport = ref(null);

const loadSupportDetail = async (support_id) => {
  console.log("부모로 들어온 ID:", support_id);

  if (!support_id) {
    selectedSupport.value = null;
    info.support_id = "";
    return;
  }

  // 먼저 즉시 저장
  info.support_id = support_id;
  selectedSupport.value = { support_id };
  try {
    const response = await fetch(
      `http://localhost:3000/survey/support/${support_id}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      console.log("실제 받은 데이터:", data[0]);
      selectedSupport.value = data[0];
      info.support_id = data[0].support_id ?? "";
    } else if (data) {
      selectedSupport.value = data;
      info.support_id = data.support_id ?? "";
    } else {
      selectedSupport.value = null;
    }

    // console.log("selectedSupport.value =", selectedSupport.value);
    // console.log("info.support_id =", info.support_id);
  } catch (err) {
    console.error("대상자 정보를 불러오는데 실패했습니다.", err);
    selectedSupport.value = null;
  }
};

onMounted(async () => {
  const idFromQuery = route.query.support_id;
  if (idFromQuery) {
    await loadSupportDetail(idFromQuery);
  }
});

const info = reactive({
  J_ID: "",
  Ver_Id: "",
  G_UserId: "GUSR0000",
  support_id: "",
  result: null,
  reason: null,
  created_at: null,
  updated_at: null,
});

const isPrinted = ref(false);

const surveyInfo = async (payload) => {
  console.log("payload =", payload);
  // console.log("selectedSupport.value =", selectedSupport.value);
  // console.log("info.support_id =", info.support_id);

  const supportIdFromSelected =
    selectedSupport.value?.support_id ??
    selectedSupport.value?.supportId ??
    selectedSupport.value?.id ??
    null;

  const finalSupportId =
    payload?.support_id ??
    payload?.answers?.[0]?.support_id ??
    supportIdFromSelected ??
    info.support_id ??
    null;

  // console.log("supportIdFromSelected =", supportIdFromSelected);
  // console.log("finalSupportId =", finalSupportId);

  if (!finalSupportId) {
    alert("지원 대상자를 먼저 선택해주세요.");
    return;
  }

  if (!payload?.answers || payload.answers.length === 0) {
    alert("답변 데이터가 없습니다.");
    return;
  }

  const sendData = {
    ...payload,
    G_UserId: info.G_UserId,
    Ver_Id: info.Ver_Id || "FORM0004",
    support_id: finalSupportId,
    answers: payload.answers.map((ans) => ({
      ...ans,
      support_id: ans.support_id ?? finalSupportId,
      G_UserId: info.G_UserId,
    })),
  };
  // console.log("최종 전송 데이터 =", sendData);
  // sendData.answers = payload.answers; //surveyCard에 있는 answers 코드 안에 있는 예/아니오 데이터 가져옴

  try {
    const response = await fetch("http://localhost:3000/survey/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendData),
    });

    const result = await response.json();
    console.log("서버 응답 =", result);

    if (response.ok && result?.status === "success") {
      alert("정상적으로 등록되었습니다.");
      console.log(`등록되었습니다. 조사지번호 : ${result.J_ID}`);
      router.push({
        name: "userMain",
        params: { no: result.J_ID },
      });
    } else {
      isPrinted.value = true;
      alert(result?.message || "등록에 실패했습니다.");
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
