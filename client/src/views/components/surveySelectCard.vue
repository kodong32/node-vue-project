<template>
  <div class="py-4 container-fluid survey-view-page">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11">
        <div class="survey-header-container shadow-sm mb-0">
          <div
            class="d-flex align-items-center p-3 px-4 text-white header-bg position-relative"
          >
            <h5 class="mb-0 font-weight-bolder text-white">홍길동님 조사지</h5>

            <div class="date-center">
              <span class="text-sm font-weight-bold opacity-9"
                >등록일 : 2026.03.12</span
              >
            </div>

            <button
              class="btn-close btn-close-white ms-auto"
              aria-label="Close"
              @click="$router.back()"
            ></button>
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
                        >
                          {{ qIdx + 1 }}
                        </td>
                        <td
                          class="text-sm text-dark text-wrap py-3 ps-3 align-middle"
                        >
                          {{ typeof q === "string" ? q : q.text }}

                          <div
                            v-if="
                              q.hasExtraInput &&
                              getSafeAnswer(sIdx, subIdx, qIdx) === '예'
                            "
                            class="mt-3 p-3 bg-gray-100 border-radius-md border extra-info-box"
                          >
                            <div class="mb-2">
                              <span class="badge bg-info-soft text-info mb-1"
                                >[구체적 사유]</span
                              >
                              <div class="text-xs text-dark ps-1 fw-bold">
                                {{ extraInputs.reason || "내용 없음" }}
                              </div>
                            </div>
                            <div>
                              <span class="badge bg-info-soft text-info mb-1"
                                >[필요시기]</span
                              >
                              <div class="text-xs text-dark ps-1 fw-bold">
                                {{ extraInputs.date || "내용 없음" }}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="text-center border-start align-middle">
                          <div
                            class="result-box"
                            :class="{
                              'active-check':
                                getSafeAnswer(sIdx, subIdx, qIdx) === '예',
                            }"
                          >
                            <span
                              v-if="getSafeAnswer(sIdx, subIdx, qIdx) === '예'"
                              >✔</span
                            >
                          </div>
                        </td>
                        <td class="text-center border-start align-middle">
                          <div
                            class="result-box"
                            :class="{
                              'active-check':
                                getSafeAnswer(sIdx, subIdx, qIdx) === '아니오',
                            }"
                          >
                            <span
                              v-if="
                                getSafeAnswer(sIdx, subIdx, qIdx) === '아니오'
                              "
                              >✔</span
                            >
                          </div>
                        </td>
                      </tr>
                      <tr v-if="subIdx < section.subs.length - 1">
                        <td colspan="4" class="p-2 bg-white border-0"></td>
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
              <div
                class="p-4 bg-gray-100 border-radius-lg text-sm text-dark min-vh-10 border shadow-none comment-box"
              >
                {{ extraRequest || "입력된 추가 요청사항이 없습니다." }}
              </div>
            </div>

            <div class="d-flex justify-content-center mt-5 mb-4">
              <router-link
                :to="{ name: 'userMain' }"
                class="btn btn-list-back px-7 py-2-5 shadow-sm"
              >
                목록으로
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 페이지 진입 시 사이드바 숨김 처리
onMounted(() => {
  document.body.classList.remove("g-sidenav-show");
  // 강제로 스타일 주입 (사이드바 요소가 있을 경우)
  const sidenav = document.getElementById("sidenav-main");
  if (sidenav) {
    sidenav.style.setProperty("display", "none", "important");
  }
});

// 페이지 이탈 시 다시 사이드바 복구 (다른 페이지 영향 방지)
onUnmounted(() => {
  document.body.classList.add("g-sidenav-show");
  const sidenav = document.getElementById("sidenav-main");
  if (sidenav) {
    sidenav.style.display = ""; // 원래 상태로 복구
  }
});

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

const answers = ref([
  [
    ["예", "예", "아니오"],
    ["예", "예", "아니오"],
    ["아니오", "아니오", "예"],
  ],
  [
    ["예", "아니오", "예"],
    ["예", "아니오"],
  ],
  [
    ["예", "예", "아니오"],
    ["아니오", "아니오"],
  ],
]);

const extraInputs = ref({ reason: "거동이 매우 불편함", date: "2026년 4월" });
const extraRequest = ref("가급적 빠른 처리를 부탁드립니다.");

const getSafeAnswer = (sIdx, subIdx, qIdx) => {
  try {
    return answers.value[sIdx][subIdx][qIdx] || "";
  } catch (e) {
    return "";
  }
};
</script>

<style>
/* 중요: scoped가 없는 전역 스타일입니다. 
   사이드바는 레이아웃에 있으므로 여기서 강제로 제어해야 합니다. */
#sidenav-main,
.sidenav,
aside {
  display: none !important;
}

/* 본문 영역 왼쪽 여백 강제 제거 */
.main-content,
#panel {
  margin-left: 0 !important;
  padding-left: 0 !important;
}

/* 전체 배경 처리 */
body.g-sidenav-show {
  overflow-x: hidden !important;
}
</style>

<style scoped>
/* 페이지 내부 디자인용 scoped 스타일 */
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
  transform: translateX(-50%);
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

.result-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid #c1c9d0;
  border-radius: 4px;
  background-color: #fff;
  color: transparent;
}
.active-check {
  background-color: #8e99a7 !important;
  border-color: #8e99a7 !important;
  color: white !important;
  font-size: 14px;
}

.bg-info-soft {
  background-color: #e8f9fd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
}

.btn-list-back {
  background-color: #7a89a0;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  padding-left: 4rem !important;
  padding-right: 4rem !important;
}

.text-wrap {
  word-break: keep-all;
  line-height: 1.6;
}
.border-end {
  border-right: 1px solid #dee2e6 !important;
}
.border-start {
  border-left: 1px solid #dee2e6 !important;
}
</style>
