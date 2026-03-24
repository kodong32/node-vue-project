<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-lg mb-4">
          <div class="card-header pb-0 p-4">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0 font-weight-bolder text-info">조사지 신청하기</h6>
              <div class="d-flex align-items-center">
                <span class="text-sm me-2 text-secondary font-weight-bold"
                  >작성일</span
                >
                <div class="date-display p-2 bg-light border-radius-md border">
                  <span class="text-xs font-weight-bold">2026.03.12</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-body p-4">
            <template v-for="(section, sIdx) in allSections" :key="sIdx">
              <div
                class="d-flex justify-content-between align-items-center mb-4 p-3 bg-gray-100 border-radius-lg"
                :class="{ 'mt-5': sIdx > 0 }"
              >
                <div class="d-flex align-items-center">
                  <span class="text-success me-2">●</span>
                  <span class="text-sm font-weight-bolder">{{
                    section.title
                  }}</span>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table align-items-center mb-0 border-top">
                  <thead>
                    <tr class="bg-light">
                      <th colspan="2" class="ps-4 text-sm font-weight-bolder">
                        설문 항목
                      </th>
                      <th class="text-center text-xs text-secondary">예</th>
                      <th class="text-center text-xs text-secondary">아니오</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(sub, subIdx) in section.subs"
                      :key="subIdx"
                    >
                      <tr class="bg-gray-100">
                        <td
                          colspan="4"
                          class="py-2 ps-4 text-xs font-weight-bold text-info text-uppercase"
                        >
                          {{ sub.subTitle }}
                          <span
                            v-if="sub.description"
                            class="ms-2 font-weight-normal text-secondary text-lowercase"
                          >
                            {{ sub.description }}
                          </span>
                        </td>
                      </tr>
                      <template v-for="(q, qIdx) in sub.questions" :key="qIdx">
                        <tr>
                          <td class="text-center text-xs text-secondary ps-4">
                            {{ qIdx + 1 }}
                          </td>
                          <td class="text-sm text-dark text-wrap align-top">
                            <div class="mb-1">
                              {{ typeof q === "string" ? q : q.text }}
                            </div>

                            <div
                              v-if="q.hasExtraInput"
                              class="mt-2 p-0 border-0"
                            >
                              <div class="col-12 mb-2">
                                <label
                                  class="text-xs font-weight-bold text-dark mb-1 d-block"
                                  >구체적 사유</label
                                >
                                <input
                                  type="text"
                                  class="form-control form-control-sm border"
                                  style="max-width: 400px"
                                  placeholder="사유를 입력해주세요"
                                  v-model="extraInputs.reason"
                                />
                              </div>
                              <div class="col-12 mb-2">
                                <label
                                  class="text-xs font-weight-bold text-dark mb-1 d-block"
                                  >필요시기</label
                                >
                                <input
                                  type="text"
                                  class="form-control form-control-sm border"
                                  style="max-width: 400px"
                                  placeholder="시기를 입력해주세요"
                                  v-model="extraInputs.date"
                                />
                              </div>
                            </div>
                          </td>
                          <td class="text-center">
                            <input
                              type="radio"
                              :name="`q_${sIdx}_${subIdx}_${qIdx}`"
                              value="예"
                              v-model="answers[sIdx][subIdx][qIdx]"
                              class="form-check-input custom-radio"
                            />
                          </td>
                          <td class="text-center">
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
                    </template>
                  </tbody>
                </table>
              </div>
            </template>

            <div class="mt-4">
              <h6 class="text-sm font-weight-bolder mb-2 text-secondary">
                <span class="text-success me-1">●</span> 추가 요청사항
              </h6>
              <textarea
                class="form-control"
                rows="4"
                v-model="extraRequest"
              ></textarea>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button class="btn btn-success me-2" @click="openModal">
                저장
              </button>
              <button class="btn btn-outline-secondary">취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content-wrapper card shadow-lg mt-5 mb-5">
          <div class="card-header bg-white pb-3 border-bottom">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0 font-weight-bolder">조사지 신청 내용 확인</h5>
              <div class="text-end">
                <span class="text-xs text-secondary d-block">작성일</span>
                <span class="text-sm font-weight-bold">2026.03.12</span>
              </div>
            </div>
          </div>

          <div class="card-body modal-scrollable p-4">
            <template v-for="(section, sIdx) in allSections" :key="'m' + sIdx">
              <div class="mb-3 mt-2 font-weight-bolder text-sm">
                <span class="text-success me-2">●</span> {{ section.title }}
              </div>
              <table class="table align-items-center mb-4 border">
                <thead class="bg-light">
                  <tr>
                    <th
                      class="ps-3 text-xs font-weight-bold"
                      style="width: 70%"
                    >
                      설문 항목
                    </th>
                    <th class="text-center text-xs font-weight-bold">예</th>
                    <th class="text-center text-xs font-weight-bold">아니오</th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-for="(sub, subIdx) in section.subs"
                    :key="'ms' + subIdx"
                  >
                    <tr class="bg-gray-100">
                      <td
                        colspan="3"
                        class="ps-3 py-1 text-xxs font-weight-bolder text-info"
                      >
                        {{ sub.subTitle }}
                      </td>
                    </tr>
                    <tr v-for="(q, qIdx) in sub.questions" :key="'mq' + qIdx">
                      <td class="ps-3 text-xs text-wrap align-top">
                        <div class="mb-1">
                          {{ qIdx + 1 }}.
                          {{ typeof q === "string" ? q : q.text }}
                        </div>
                        <div
                          v-if="
                            q.hasExtraInput &&
                            answers[sIdx][subIdx][qIdx] === '예'
                          "
                          class="mt-2 p-2 bg-gray-100 border-radius-md"
                        >
                          <div class="mb-2">
                            <span
                              class="text-xxs font-weight-bold text-info d-block mb-1"
                              >[구체적 사유]</span
                            >
                            <div class="p-2 bg-white border border-radius-sm">
                              {{ extraInputs.reason || "(입력 안 함)" }}
                            </div>
                          </div>
                          <div>
                            <span
                              class="text-xxs font-weight-bold text-info d-block mb-1"
                              >[필요시기]</span
                            >
                            <div class="p-2 bg-white border border-radius-sm">
                              {{ extraInputs.date || "(입력 안 함)" }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="text-center align-top">
                        <span
                          v-if="answers[sIdx][subIdx][qIdx] === '예'"
                          class="text-success font-weight-bolder"
                          >✔</span
                        >
                      </td>
                      <td class="text-center align-top">
                        <span
                          v-if="answers[sIdx][subIdx][qIdx] === '아니오'"
                          class="text-danger font-weight-bolder"
                          >✔</span
                        >
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </template>

            <div class="mt-3 border-top pt-3">
              <h6 class="text-sm font-weight-bolder text-secondary">
                ● 추가 요청사항
              </h6>
              <div class="p-3 bg-light border-radius-md text-sm min-vh-10">
                {{ extraRequest || "입력 사항 없음" }}
              </div>
            </div>
          </div>

          <div class="card-footer d-flex justify-content-between border-top">
            <button class="btn btn-info mb-0" @click="surveyInfo">등록</button>
            <button class="btn btn-outline-secondary mb-0" @click="closeModal">
              취소
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

// import { useRouter } from "vue-router";

// const router = useRouter();

const allSections = [
  //설문 전체 구조 (카테고리 → 질문)
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
            hasExtraInput: true, //추가 입력창 필요
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
  //구조를 그대로 따라가서 빈 값("")으로 초기화
  //[[ ["", "", ""], ["", "", ""] ], [ ["", "", ""], ["", ""] ],]
  //section → sub → question 순서 + 각 질문에 "예 / 아니오" 저장할 자리
);

const extraInputs = reactive({
  reason: "",
  date: "",
  //추가 입력값 저장
  //reason → 구체적 사유 + / date → 필요 시기
});

const extraRequest = ref(""); //추가 요청 텍스트 (단일 값)
const isModalOpen = ref(false); //모달 열림 여부 1. false → 닫힘 / 2. true → 열림

const openModal = () => {
  //모달 열기 / 스크롤 막기 (overflow = hidden)
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  //모달 닫기 / 스크롤 다시 가능
  isModalOpen.value = false;
  document.body.style.overflow = "auto";
};

// [1] 상단에 emit 정의 (함수 밖에 선언) -> 부모로 이벤트 내보내기
const emit = defineEmits(["submit-survey"]);

// [2] 등록 버튼 클릭 시 실행될 통합 함수
const surveyInfo = () => {
  //설문 제출 함수 시작
  // 1. 부모(survey.vue)에게 신호와 데이터를 함께 보냄
  emit("submit-survey", {
    answers: answers, // 사용자가 체크한 '예/아니오' 배열
    extraInputs: extraInputs, // 구체적 사유 및 필요시기
  });

  // 2. 알림창 표시 (선택사항 - 부모에서 띄워도 됩니다)
  alert("정상적으로 등록되었습니다.");

  // 3. 확인 모달 닫기
  closeModal(); //모달 닫기

  // ⚠️ 주의: 자식에서 router.push를 하면 부모의 통신 로직이 완료되기 전에
  // 페이지가 이동될 수 있습니다. 페이지 이동은 부모(survey.vue)의
  // surveyInfo 함수 마지막에 넣는 것을 권장합니다.
};
</script>

<style scoped>
.custom-radio {
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;
  border: 1px solid #d2d6da;
}
.custom-radio:checked {
  background-color: #2dce89;
  border-color: #2dce89;
}
.table td {
  padding: 0.75rem 0.5rem;
}
.bg-gray-100 {
  background-color: #f8f9fa !important;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1050;
  overflow-y: auto;
}
.modal-content-wrapper {
  width: 90%;
  max-width: 800px;
  background: white;
  border-radius: 1rem;
  margin: 2rem 0;
}
.modal-scrollable {
  max-height: 70vh;
  overflow-y: auto;
}
.text-wrap {
  white-space: normal !important;
}
.border-radius-sm {
  border-radius: 4px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
