<script setup>
import { ref, reactive } from "vue";

const allSections = [
  {
    title: "지원사유",
    subs: [
      {
        subTitle: "긴급 지원 필요",
        description: "즉시 지원인식 및 서비스 필요",
        questions: [
          "현재 긴급하게 도움이 필요한 상황(주거, 건강, 안전 등)이 있다.",
          "최근 돌봄 제공자(가족, 보호자)의 부재 또는 돌봄 공백이 발생하였다.",
          "현재 상황이 즉각적인 공공기관 또는 서비스 지원이 필요할 정도로 위급하다.",
        ],
      },
      {
        subTitle: "중점 지원 필요",
        description: "즉시 지원인식 및 서비스 필요",
        questions: [
          "일상생활을 유지하기 위해 지속적인 도움이나 지원 서비스가 필요하다.",
          "현재 받고 있는 지원만으로는 생활 유지에 어려움이 있다.",
          "특정 영역(건강, 생활, 이동 등)에서 우선적으로 지원이 필요하다.",
        ],
      },
      {
        subTitle: "계획 수립 필요",
        description: "즉시 지원인식 및 서비스 필요",
        questions: [
          "앞으로의 생활 또는 서비스 이용을 위한 장기적인 계획이 필요하다.",
          "현재 이용 가능한 지원 서비스나 제도에 대한 안내 및 상담이 필요하다.",
          {
            text: "향후 생활 지원을 위한 개인 맞춤형 계획 수립이 필요하다.",
            hasExtraInput: true,
          },
        ],
      },
    ],
  },
  {
    title: "지원이 필요한 서비스",
    subs: [
      {
        subTitle: "개인별 지원",
        questions: [
          "개인의 상황에 맞는 맞춤형 지원 서비스가 필요하다.",
          "일상생활(식사, 위생, 정리 등)에 개인 지원이 필요하다.",
          "개인 활동(외출, 사회활동 등)에 도움이 필요하다.",
        ],
      },
      {
        subTitle: "교통",
        questions: [
          "병원, 복지시설 등 필요한 장소로 이동하는데 어려움이 있다.",
          "대중교통 이용이 어렵거나 제한이 있다.",
        ],
      },
    ],
  },
  {
    title: "이용중인 복지 서비스",
    subs: [
      {
        subTitle: "생활안정",
        questions: [
          "현재 생활비 또는 기본적인 생계 유지에 어려움이 있다.",
          "안정적인 주거 환경 유지에 어려움이 있다.",
          "생활을 유지하기 위해 추가적인 경제적 지원이 필요하다.",
        ],
      },
      {
        subTitle: "고용",
        questions: [
          "취업을 원하지만 취업 기회를 얻기 어렵다.",
          "취업을 위해 직업 교육 또는 취업 지원 서비스가 필요하다.",
        ],
      },
    ],
  },
];

const answers = reactive(
  allSections.map((s) => s.subs.map((sub) => sub.questions.map(() => ""))),
);

const extraRequest = ref("");
const isModalOpen = ref(false);
const extraInputs = reactive({ result: "", reason: "", date: "" });

const props = defineProps({
  selectedSupport: {
    type: Object,
    default: null,
  },
});

const openModal = () => {
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "auto";
};

const emit = defineEmits(["submit-survey"]);

const surveyInfo = () => {
  for (let sIdx = 0; sIdx < allSections.length; sIdx++) {
    for (let subIdx = 0; subIdx < allSections[sIdx].subs.length; subIdx++) {
      for (
        let qIdx = 0;
        qIdx < allSections[sIdx].subs[subIdx].questions.length;
        qIdx++
      ) {
        const answer = answers[sIdx][subIdx][qIdx];
        const question = allSections[sIdx].subs[subIdx].questions[qIdx];

        if (!answer) {
          alert(
            `"${allSections[sIdx].title} > ${allSections[sIdx].subs[subIdx].subTitle}"
            질문 ${qIdx + 1}에 예/아니오를 선택해주세요.`,
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

  let flatAnswers = [];
  let qIdCount = 1;

  for (let sIdx = 0; sIdx < allSections.length; sIdx++) {
    for (let subIdx = 0; subIdx < allSections[sIdx].subs.length; subIdx++) {
      for (
        let qIdx = 0;
        qIdx < allSections[sIdx].subs[subIdx].questions.length;
        qIdx++
      ) {
        flatAnswers.push({
          question_id: "ITEM" + String(qIdCount).padStart(4, "0"),
          answer: answers[sIdx][subIdx][qIdx],
        });
        qIdCount++;
      }
    }
  }

  emit("submit-survey", {
    answers: flatAnswers,
    extraInputs: extraInputs,
    extraRequest: extraRequest.value,
    support_id: props.selectedSupport?.support_id,
  });
  closeModal();
};

const resetCancel = () => {
  allSections.forEach((section, sIdx) => {
    section.subs.forEach((sub, subIdx) => {
      sub.questions.forEach((_, qIdx) => {
        answers[sIdx][subIdx][qIdx] = "";
      });
    });
  });
  extraInputs.reason = "";
  extraInputs.date = "";
  extraRequest.value = "";
  closeModal();
};

//날짜
const dateFormat = (dateVal) => {
  let newDate = new Date(dateVal);
  let year = newDate.getFullYear();
  let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
  let day = ("0" + newDate.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
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
                          {{
                            sub.description || "즉시 지원인식 및 서비스 필요"
                          }}
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
                          {{ typeof q === "string" ? q : q.text }}
                          <div
                            v-if="q.hasExtraInput"
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
                            type="radio"
                            :name="`q_${sIdx}_${subIdx}_${qIdx}`"
                            value="예"
                            v-model="answers[sIdx][subIdx][qIdx]"
                            class="form-check-input custom-radio"
                          />
                        </td>
                        <td class="text-center border-start align-middle">
                          <input
                            type="radio"
                            :name="`q_${sIdx}_${subIdx}_${qIdx}`"
                            value="아니오"
                            v-model="answers[sIdx][subIdx][qIdx]"
                            class="form-check-input custom-radio"
                          />
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </template>

            <div class="mt-5 mb-5">
              <h6 class="text-sm font-weight-bolder mb-3 text-dark">
                <span class="text-success me-1">●</span> 추가 요청사항
              </h6>
              <textarea
                class="form-control comment-box"
                rows="4"
                v-model="extraRequest"
                placeholder="추가로 요청하실 사항을 적어주세요."
              ></textarea>
            </div>

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

    <!-- 모달창 템플릿 / Transition 쓰는 이유는 모달창이 부드럽게 열리게 하려고 사용함-->
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
              <div class="section-title-box mb-3" :class="{ 'mt-4': sIdx > 0 }">
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
                      :key="'ms' + subIdx"
                    >
                      <tr class="sub-header-row bg-white">
                        <td
                          class="text-success font-weight-bolder text-sm ps-3 py-2 border-bottom-dark"
                          style="width: 20%"
                        >
                          {{ sub.subTitle }}
                        </td>
                        <td
                          class="text-dark font-weight-bolder text-sm ps-3 py-2 border-bottom-dark"
                        >
                          {{
                            sub.description || "즉시 지원인식 및 서비스 필요"
                          }}
                        </td>
                        <td
                          class="text-center text-dark font-weight-bolder text-sm py-2 border-bottom-dark border-start"
                          style="width: 70px"
                        >
                          예
                        </td>
                        <td
                          class="text-center text-dark font-weight-bolder text-sm py-2 border-bottom-dark border-start"
                          style="width: 70px"
                        >
                          아니오
                        </td>
                      </tr>

                      <tr
                        v-for="(q, qIdx) in sub.questions"
                        :key="'mq' + qIdx"
                        class="question-row"
                      >
                        <td
                          class="text-center text-secondary text-xs font-weight-bold border-end align-middle"
                          style="width: 50px"
                        >
                          {{ qIdx + 1 }}
                        </td>
                        <td
                          class="text-sm text-dark text-wrap py-2 ps-3 align-middle"
                        >
                          {{ typeof q === "string" ? q : q.text }}
                          <div
                            v-if="
                              q.hasExtraInput &&
                              answers[sIdx][subIdx][qIdx] === '예'
                            "
                            class="mt-2 p-2 bg-gray-100 border-radius-md text-xs border"
                          >
                            <span class="text-success font-weight-bold"
                              >[사유]</span
                            >
                            {{ extraInputs.reason || "-" }}
                            <span class="ms-2 text-success font-weight-bold"
                              >[시기]</span
                            >
                            {{ extraInputs.date || "-" }}
                          </div>
                        </td>
                        <td class="text-center border-start align-middle">
                          <div
                            v-if="answers[sIdx][subIdx][qIdx] === '예'"
                            class="selected-dot mx-auto"
                          ></div>
                        </td>
                        <td class="text-center border-start align-middle">
                          <div
                            v-if="answers[sIdx][subIdx][qIdx] === '아니오'"
                            class="selected-dot mx-auto"
                          ></div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </template>

            <div class="mt-4">
              <h6 class="text-sm font-weight-bolder mb-2 text-dark">
                <span class="text-success me-1">●</span> 추가 요청사항
              </h6>
              <div
                class="p-3 bg-gray-100 border-radius-md text-sm border min-vh-10"
              >
                {{ extraRequest || "내용 없음" }}
              </div>
            </div>
          </div>

          <div
            class="modal-footer d-flex justify-content-center bg-white border-top py-3"
          >
            <button
              class="btn btn-success px-5 py-2 me-2 shadow-sm"
              @click="surveyInfo"
            >
              등록
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
