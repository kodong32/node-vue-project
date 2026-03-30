<script setup>
import { ref, reactive, watch } from "vue";

const props = defineProps({
  selectedSupport: {
    type: Object,
    default: null,
  },
  // [추가] 부모(surveyRegister)로부터 관리자가 수정한 문항 데이터를 받습니다.
  sections: {
    type: Array,
    default: () => [],
  },
});

// [수정] 하드코딩된 데이터는 삭제하고, props로 받은 데이터를 사용합니다.
const allSections = ref([]);
const answers = ref([]);

// [추가] 부모로부터 문항 데이터가 들어오면 답변 배열을 그 크기에 맞게 초기화합니다.
watch(
  () => props.sections,
  (newSections) => {
    if (newSections && newSections.length > 0) {
      allSections.value = newSections;
      // 문항 구조에 맞게 답변 배열 생성 (전부 빈값으로 초기화)
      answers.value = newSections.map((s) =>
        s.subs.map((sub) => sub.questions.map(() => "")),
      );
    }
  },
  { immediate: true },
);

const extraRequest = ref("");
const isModalOpen = ref(false);
const extraInputs = reactive({ result: "", reason: "", date: "" });

const openModal = () => {
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "auto";
};

const emit = defineEmits(["submit-survey"]);

// [수정] 유효성 검사 및 데이터 전송 로직
const surveyInfo = () => {
  for (let sIdx = 0; sIdx < allSections.value.length; sIdx++) {
    for (
      let subIdx = 0;
      subIdx < allSections.value[sIdx].subs.length;
      subIdx++
    ) {
      for (
        let qIdx = 0;
        qIdx < allSections.value[sIdx].subs[subIdx].questions.length;
        qIdx++
      ) {
        const answer = answers.value[sIdx][subIdx][qIdx];
        const question = allSections.value[sIdx].subs[subIdx].questions[qIdx];

        if (!answer && question.answer_type === "e001") {
          alert(
            `"${allSections.value[sIdx].title} > ${allSections.value[sIdx].subs[subIdx].subTitle}"\n질문 ${qIdx + 1}에 예/아니오를 선택해주세요.`,
          );
          return;
        }

        if (answer === "예" && question.hasExtraInput) {
          if (!extraInputs.reason.trim() || !extraInputs.date.trim()) {
            alert(
              `질문 ${qIdx + 1}에 대해 구체적 사유와 필요 시기를 입력해주세요.`,
            );
            return;
          }
        }
      }
    }
  }

  // [수정] 서버 전송용 데이터 포맷팅 (DB 컬럼명에 맞춰 ID 전달)
  let flatAnswers = [];
  allSections.value.forEach((section, sIdx) => {
    section.subs.forEach((sub, subIdx) => {
      sub.questions.forEach((q, qIdx) => {
        flatAnswers.push({
          question_id: q.question_id, // 서버에서 가져온 실제 ID 사용
          answer: answers.value[sIdx][subIdx][qIdx],
          titleCode: section.title, // 필요시 추가
        });
      });
    });
  });

  emit("submit-survey", {
    answers: flatAnswers,
    extraInputs: extraInputs,
    extraRequest: extraRequest.value,
    support_id: props.selectedSupport?.support_id,
  });
  closeModal();
};

const resetCancel = () => {
  if (confirm("작성 내용을 초기화하시겠습니까?")) {
    answers.value = allSections.value.map((s) =>
      s.subs.map((sub) => sub.questions.map(() => "")),
    );
    extraInputs.reason = "";
    extraInputs.date = "";
    extraRequest.value = "";
    closeModal();
  }
};

const dateFormat = (dateVal) => {
  if (!dateVal) return "-";
  let newDate = new Date(dateVal);
  return `${newDate.getFullYear()}-${("0" + (newDate.getMonth() + 1)).slice(-2)}-${("0" + newDate.getDate()).slice(-2)}`;
};

const today = ref(new Date());
const todayAdd = new Date().toISOString().split("T")[0];
</script>

<template>
  <div class="py-4 container-fluid survey-view-page">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11">
        <div class="survey-header-container shadow-sm mb-0">
          <div
            class="d-flex align-items-center p-3 px-4 text-white header-bg position-relative"
          >
            <h5 class="mb-0 font-weight-bolder text-white">조사지 신청하기</h5>
            <div class="date-center">
              <span class="text-sm font-weight-bold opacity-9"
                >등록일 : {{ dateFormat(today) }}</span
              >
            </div>
          </div>
        </div>

        <div class="card shadow-lg border-radius-top-none mb-5">
          <div class="card-body p-4 pt-5">
            <template v-for="(section, sIdx) in allSections" :key="sIdx">
              <div class="section-title-box mb-3" :class="{ 'mt-5': sIdx > 0 }">
                <div class="d-flex align-items-center">
                  <span class="dot-icon me-2">●</span>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ section.title }}
                  </h6>
                </div>
              </div>

              <div class="table-responsive mb-4">
                <table
                  class="table align-items-center mb-0 custom-bordered-table"
                >
                  <tbody>
                    <template
                      v-for="(sub, subIdx) in section.subs"
                      :key="subIdx"
                    >
                      <tr class="sub-header-row bg-white">
                        <td
                          class="text-success font-weight-bolder text-sm ps-3 py-3 border-bottom-dark"
                          style="width: 15%"
                        >
                          {{ sub.subTitle }}
                        </td>
                        <td
                          class="text-dark font-weight-bolder text-sm ps-3 py-3 border-bottom-dark"
                        >
                          {{ sub.description }}
                        </td>
                        <td
                          class="text-center text-dark font-weight-bolder text-sm py-3 border-bottom-dark border-start"
                          style="width: 80px"
                        >
                          예
                        </td>
                        <td
                          class="text-center text-dark font-weight-bolder text-sm py-3 border-bottom-dark border-start"
                          style="width: 80px"
                        >
                          아니오
                        </td>
                      </tr>

                      <tr
                        v-for="(q, qIdx) in sub.questions"
                        :key="qIdx"
                        class="question-row"
                      >
                        <td
                          class="text-center text-secondary text-sm font-weight-bold border-end align-middle"
                          style="width: 50px"
                        >
                          {{ qIdx + 1 }}
                        </td>
                        <td
                          class="text-sm text-dark text-wrap py-3 ps-3 align-middle"
                        >
                          {{ q.text }}

                          <div v-if="q.answer_type === 'e002'" class="mt-2">
                            <textarea
                              class="form-control form-control-sm"
                              rows="3"
                              v-model="answers[sIdx][subIdx][qIdx]"
                              placeholder="내용을 입력해주세요."
                            ></textarea>
                          </div>

                          <div
                            v-if="
                              q.hasExtraInput &&
                              answers[sIdx][subIdx][qIdx] === '예'
                            "
                            class="mt-3 p-3 bg-gray-100 border-radius-md border extra-info-box"
                          >
                            <div class="row">
                              <div class="col-md-6 mb-2">
                                <label
                                  class="text-xs font-weight-bold text-dark mb-1 d-block"
                                  >[구체적 사유]</label
                                >
                                <input
                                  type="text"
                                  class="form-control form-control-sm"
                                  v-model="extraInputs.reason"
                                  placeholder="사유를 입력해주세요"
                                />
                              </div>
                              <div class="col-md-6 mb-2">
                                <label
                                  class="text-xs font-weight-bold text-dark mb-1 d-block"
                                  >[필요시기]</label
                                >
                                <input
                                  type="date"
                                  class="form-control form-control-sm"
                                  v-model="extraInputs.date"
                                  :min="todayAdd"
                                />
                              </div>
                            </div>
                          </div>
                        </td>

                        <td class="text-center border-start align-middle">
                          <input
                            v-if="q.answer_type === 'e001'"
                            type="radio"
                            :name="`q_${sIdx}_${subIdx}_${qIdx}`"
                            value="예"
                            v-model="answers[sIdx][subIdx][qIdx]"
                            class="form-check-input custom-radio"
                          />
                          <span v-else class="text-secondary">-</span>
                        </td>
                        <td class="text-center border-start align-middle">
                          <input
                            v-if="q.answer_type === 'e001'"
                            type="radio"
                            :name="`q_${sIdx}_${subIdx}_${qIdx}`"
                            value="아니오"
                            v-model="answers[sIdx][subIdx][qIdx]"
                            class="form-check-input custom-radio"
                          />
                          <span v-else class="text-secondary">-</span>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </template>

            <div class="d-flex justify-content-center mt-5 mb-4">
              <button
                class="btn btn-success px-6 py-2-5 me-3 shadow-sm"
                @click="openModal"
              >
                저장하기
              </button>
              <button
                class="btn btn-outline-secondary px-6 py-2-5 shadow-sm"
                @click="resetCancel"
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-content-wrapper shadow-lg">
          <div class="header-bg p-3 px-4 position-relative">
            <h5 class="mb-0 font-weight-bolder text-white">
              조사지 신청 내용 확인
            </h5>
            <div class="date-center">
              <span class="text-white text-sm font-weight-bold opacity-9"
                >등록일 : {{ dateFormat(today) }}</span
              >
            </div>
          </div>
          <div class="card-body modal-scrollable p-4 bg-white">
            <template v-for="(section, sIdx) in allSections" :key="'m' + sIdx">
              <div class="section-title-box mb-3">{{ section.title }}</div>
              <div v-for="(sub, subIdx) in section.subs" :key="'ms' + subIdx">
                <div v-for="(q, qIdx) in sub.questions" :key="'mq' + qIdx">
                  <p v-if="answers[sIdx][subIdx][qIdx]">
                    질문: {{ q.text }} / 답변: {{ answers[sIdx][subIdx][qIdx] }}
                  </p>
                </div>
              </div>
            </template>
          </div>
          <div
            class="modal-footer d-flex justify-content-center bg-white border-top py-3"
          >
            <button
              class="btn btn-success px-5 py-2 me-2 shadow-sm"
              @click="surveyInfo"
            >
              최종 등록
            </button>
            <button
              class="btn btn-outline-secondary px-5 py-2 shadow-sm"
              @click="closeModal"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 조회 페이지 & 모달 공통 스타일 */
.survey-view-page {
  font-family: "Noto Sans KR", sans-serif;
  color: #333;
}
.header-bg {
  background-color: #5dbe8a !important;
  border-radius: 12px 12px 0 0;
}
.date-center {
  position: absolute;
  left: 50%;
  top: 50%; /* 부모(header-bg)의 세로 중앙으로 이동 */
  transform: translate(-50%, -50%); /* 가로/세로 중앙 정렬 완성 */
  display: flex;
  align-items: center;
}
.border-radius-top-none {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
.dot-icon {
  color: #49d38a;
  font-size: 0.9rem;
}
.section-title-box {
  border-bottom: 2px solid #ebf1f5;
  padding-bottom: 8px;
}
.custom-bordered-table {
  border: 1px solid #dee2e6;
  border-collapse: collapse;
  width: 100%;
}
.sub-header-row {
  border-top: 2px solid #333;
}
.border-bottom-dark {
  border-bottom: 1px solid #333 !important;
}
.question-row {
  border-bottom: 1px solid #dee2e6;
}
.custom-radio {
  width: 22px;
  height: 22px;
  cursor: pointer;
  border: 2px solid #c1c9d0;
}
.custom-radio:checked {
  background-color: #5dbe8a;
  border-color: #5dbe8a;
}
.extra-info-box {
  background-color: #f8f9fa;
}
.comment-box {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
}
.px-6 {
  padding-left: 3rem !important;
  padding-right: 3rem !important;
}

/* 수정된 모달 전용 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content-wrapper {
  width: 95%;
  max-width: 900px; /* 메인 카드 너비와 유사하게 조정 */
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh; /* 화면을 벗어나지 않게 */
  position: relative;
  z-index: 1060;
}

.modal-scrollable {
  overflow-y: auto;
  flex: 1;
}

/* 선택된 항목 표시용 녹색 점 (라디오 버튼 스타일) */
.selected-dot {
  width: 18px;
  height: 18px;
  background-color: #5dbe8a;
  border-radius: 50%;
  border: 2px solid #5dbe8a;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  gap: 10px;
}

/* 페이드 효과 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
