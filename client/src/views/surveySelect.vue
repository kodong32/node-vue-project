<template>
  <surveyTop />
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- allSections를 props로 넘김 -->
        <SelectCard :sections="allSections" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SelectCard from "./components/surveySelectCard.vue";
import surveyTop from "./components/surveyHeader.vue";

//조사지 조회 함수
const allSections = ref([]); // 문항 데이터
const answers = ref([]); // 선택된 답변
const extraInputs = ref({}); // 추가 입력
const extraRequest = ref(""); // 추가 요청사항

onMounted(async () => {
  try {
    const J_Id = "FORM0001"; // 조회할 설문지 ID 정의

    const response = await fetch(`/api/survey/getQuestionsByJID/${J_Id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    //결과가 ok 아니면 무조건 에러 발생시킴

    const rawQuestions = await response.json();
    //response 결과 값을 json으로 변환해서 rawQuestions 변수에 저장
    console.log("DB에서 내려온 데이터:", rawQuestions);

    //Vue template에서 사용할 형태로 데이터를 변환하기 위한 객체 초기화
    const sectionsMap = {};
    //sectionsMap = {
    //"SECTION01": { title: "SECTION01", subs: [ ... ] },
    //"SECTION02": { title: "SECTION02", subs: [ ... ] }
    //}

    rawQuestions.forEach((q) => {
      const sectionKey = q.titleCode;

      // 해당 titleCode(section)가 sectionsMap에 없으면 새로 생성
      if (!sectionsMap[sectionKey]) {
        sectionsMap[sectionKey] = {
          title: q.titleCode, // 섹션 제목
          subs: [], // 하위 항목(sub)들을 담을 배열
        };
      }

      // subs 배열에서 subTitle 있는지 확인
      let sub = sectionsMap[sectionKey].subs.find(
        //find : 조건에 맞는 첫번째 요소를 변환해줌
        (s) => s.subTitle === (q.subTitle || ""),
        //s : 각 배열의 sub 객체를 의미
        //q.subTitle || "" → 현재 문항의 subTitle이 없으면 빈 문자열로 처리
      );

      //subs 배열에 없으면 새 sub 객체를 만들어 추가
      //만약 sub가 없으면 → 현재 문항의 하위 항목(sub)이 아직 섹션에 없는 경우
      //새로 sub 객체를 생성 : 하위 항목(sub)을 초기화하는 단계
      if (!sub) {
        sub = {
          subTitle: q.subTitle || "", // DB에서 가져온 하위 제목. 없으면 빈 문자열
          description: q.description || "", //DB에서 가져온 설명. 없으면 빈 문자열
          questions: [], // 이 sub에 속한 문항들을 담을 배열
        };
        sectionsMap[sectionKey].subs.push(sub);
        //sectionsMap[sectionKey].subs.push(sub);
      }

      // 해당 sub에 질문(question) 객체 추가
      sub.questions.push({
        text: q.question_text, // 질문 텍스트
        question_id: q.question_id, // 질문 고유 ID
        hasExtraInput: q.hasExtraInput || false, // 추가 입력 여부
        // isEmergency: q.isEmergency || false, // 긴급 지원 여부
      });
    });

    allSections.value = Object.values(sectionsMap).map((s) => ({
      ...s,
      subs: s.subs.map((sub) => ({
        ...sub,
        questions: [...sub.questions],
      })),
    }));

    console.log("뷰용 구조:", [allSections.value]);

    //새로 불러온 문항에 맞춰 이전 입력값 모두 초기화
    answers.value = [];
    extraInputs.value = {};
    extraRequest.value = "";
  } catch (err) {
    console.error("조사지 데이터 불러오기 실패:", err);
  }
});
</script>
