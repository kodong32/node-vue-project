<template>
  <surveyTop />
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <SelectCard
          v-if="allSections.length > 0"
          :sections="allSections"
          :answers="answerData"
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

const allSections = ref([]);
const answerData = ref([]);
const extraInputs = ref({});
const extraRequest = ref("");
const targetUserName = ref("");
const targetRegDate = ref("");

onMounted(async () => {
  try {
    const J_ID = Object.keys(route.query)[0];

    // console.log("보내는 J_ID 값:", J_ID);
    const response = await fetch(`http://localhost:3000/survey/user/${J_ID}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawQuestions = await response.json();
    console.log("DB에서 내려온 데이터:", rawQuestions);

    if (rawQuestions.length > 0) {
      targetUserName.value = rawQuestions[0].userName || "이름없음";
      targetRegDate.value = rawQuestions[0].created_at || "-";
    }

    const allAnswers = rawQuestions.find((q) => q.answer)?.answer || "";
    const answerArray = allAnswers.split(",").map((a) => a.trim());

    const sectionsMap = {};

    rawQuestions.forEach((item, index) => {
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
        answer_type: item.answer_type,
      });

      sub.tempAnswerList.push(answerArray[index] || "");
    });

    const finalSections = Object.values(sectionsMap);
    //객체에서 값만 가지고와서 배열로 만듦
    allSections.value = finalSections;

    answerData.value = finalSections.map((sec) =>
      sec.subs.map((sub) => sub.tempAnswerList),
    );
  } catch (err) {
    console.error("조사지 데이터 불러오기 실패:", err);
  }
});
</script>
