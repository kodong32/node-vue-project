<template>
  <surveyTop />
  <sidebar @select-support="loadSupportDetail" />
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <SurveyCard
          v-if="allSections.length > 0"
          :sections="allSections"
          :selectedSupport="selectedSupport"
          @submit-survey="surveyInfo"
        />
        <div v-else class="text-center py-5 card shadow-sm">
          <span class="p-4">최신 설문 문항을 불러오는 중입니다...</span>
        </div>
      </div>
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
const allSections = ref([]);
const Ver_Id = ref(null);

const info = reactive({
  G_UserId: "GUSR0000",
  support_id: "",
  Ver_Id: "",
});

const getActiveVerId = async () => {
  try {
    const response = await fetch("http://localhost:3000/survey/getActiveVerId");
    if (!response.ok) throw new Error("Ver_Id를 가져오는 데 실패했습니다.");

    const data = await response.json();
    if (data?.Ver_Id) {
      Ver_Id.value = data.Ver_Id;
      info.Ver_Id = data.Ver_Id;
      console.log("활성 Ver_Id:", Ver_Id.value);
    } else {
      console.warn("활성 Ver_Id가 없습니다. 기본값 사용.");
      Ver_Id.value = "FORM0004";
      info.Ver_Id = "FORM0004";
    }
  } catch (err) {
    console.error("Ver_Id 로딩 에러:", err);
    Ver_Id.value = "FORM0004";
    info.Ver_Id = "FORM0004";
  }
};

const loadLatestQuestions = async () => {
  if (!Ver_Id.value) {
    console.warn("Ver_Id 없음 → 문항 로드 중단");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/survey/getQuestionsByJID/${Ver_Id.value}`,
    );

    if (!response.ok) throw new Error("문항 데이터를 가져오는데 실패했습니다.");

    const rawQuestions = await response.json();
    console.log("등록 페이지 문항 로드 완료:", rawQuestions);

    const sectionsMap = {};
    rawQuestions.forEach((item) => {
      if (!sectionsMap[item.titleCode]) {
        sectionsMap[item.titleCode] = {
          title: item.titleCode,
          subs: [],
        };
      }

      let sub = sectionsMap[item.titleCode].subs.find(
        (s) => s.subTitle === item.titleCode,
      );

      if (!sub) {
        sub = {
          subTitle: item.titleCode,
          description: "내용을 확인하고 체크해주세요.",
          questions: [],
        };
        sectionsMap[item.titleCode].subs.push(sub);
      }

      sub.questions.push({
        text: item.question_text,
        question_id: item.question_id,
        answer_type: item.answer_type,
      });
    });

    allSections.value = Object.values(sectionsMap);
  } catch (err) {
    console.error("문항 로딩 에러:", err);
  }
};

const loadSupportDetail = async (support_id) => {
  if (!support_id) {
    selectedSupport.value = null;
    info.support_id = "";
    return;
  }

  info.support_id = support_id;
  try {
    const response = await fetch(
      `http://localhost:3000/survey/support/${support_id}`,
    );
    if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      selectedSupport.value = data[0];
      info.support_id = data[0].support_id ?? "";
    } else {
      selectedSupport.value = data || null;
      if (data) info.support_id = data.support_id ?? "";
    }
  } catch (err) {
    console.error("대상자 정보 로드 실패:", err);
    selectedSupport.value = null;
  }
};

const surveyInfo = async (payload) => {
  const finalSupportId =
    payload?.support_id || selectedSupport.value?.support_id || info.support_id;

  if (!finalSupportId) {
    alert("지원 대상자를 먼저 선택해주세요.");
    return;
  }

  if (!payload?.answers || payload.answers.length === 0) {
    alert("작성된 답변이 없습니다.");
    return;
  }

  const sendData = {
    ...payload,
    G_UserId: info.G_UserId,
    Ver_Id: info.Ver_Id,
    support_id: finalSupportId,
    answers: payload.answers.map((ans) => ({
      ...ans,
      support_id: finalSupportId,
      G_UserId: info.G_UserId,
    })),
  };

  try {
    const response = await fetch("http://localhost:3000/survey/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendData),
    });

    const result = await response.json();
    if (response.ok && result?.status === "success") {
      alert("정상적으로 등록되었습니다.");
      router.push({ name: "userMain" });
    } else {
      alert(result?.message || "등록 실패");
    }
  } catch (err) {
    console.error("전송 에러:", err);
    alert("서버 연결 실패");
  }
};

onMounted(async () => {
  await getActiveVerId();
  await loadLatestQuestions();

  const idFromQuery = route.query.support_id;
  if (idFromQuery) {
    await loadSupportDetail(idFromQuery);
  }
});
</script>
