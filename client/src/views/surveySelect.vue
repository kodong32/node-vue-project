<template>
  <surveyTop />
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <SelectCard
          v-if="allSections.length > 0"
          :sections="allSections"
          :answers="answers"
          :userName="targetUserName"
          :regDate="targetRegDate"
          :extraInputs="extraInputs"
          :extraRequest="extraRequest"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SelectCard from "./components/surveySelectCard.vue";
import surveyTop from "./components/surveyHeader.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const targetUserName = ref("");
const targetRegDate = ref("");
const allSections = ref([]);
const answers = ref([]);
const extraInputs = ref({});
const extraRequest = ref("");

onMounted(async () => {
  try {
    const J_Id = route.params;
    const response = await fetch(`/api/survey/getQuestionsByJID/${J_Id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawQuestions = await response.json();
    console.log("DB에서 내려온 데이터:", rawQuestions);

    if (rawQuestions.length > 0) {
      targetUserName.value = rawQuestions[0].user_name || "이름없음";
      targetRegDate.value = rawQuestions[0].reg_date || "-";
    }

    const sectionsMap = {};
    // const tempAnswers = []; // 답변을 담을 임시 3중 배열

    rawQuestions.forEach((item) => {
      // --- [구조 1: 질문 섹션 만들기] ---
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
          description: "상세 내역 확인",
          questions: [],
          tempAnswerList: [],
        };
        sectionsMap[item.titleCode].subs.push(sub);
      }

      sub.questions.push({
        text: item.question_text,
        question_id: item.question_id,
        hasExtraInput: item.answer_type === "e001",
      });

      sub.tempAnswerList.push(item.answer || "");
    });

    const finalSections = Object.values(sectionsMap);
    allSections.value = finalSections;

    answers.value = finalSections.map((sec) =>
      sec.subs.map((sub) => sub.tempAnswerList),
    );

    extraRequest.value = rawQuestions[0]?.reason || "";
    extraInputs.value = {
      reason:
        rawQuestions.find((d) => d.answer_type === "e001")?.extra_reason || "",
      date:
        rawQuestions.find((d) => d.answer_type === "e001")?.extra_date || "",
    };
  } catch (err) {
    console.error("조사지 데이터 불러오기 실패:", err);
  }
});
</script>
