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
              <span class="text-sm font-weight-bold opacity-9">
                등록일 : {{ selectedUserInfo.formatDate }}
              </span>
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
                            class="mt-3 p-3 bg-light border-dark-strong extra-input-container"
                          >
                            <div class="row align-items-center">
                              <div
                                class="col-md-6 d-flex align-items-center mb-2 mb-md-0"
                              >
                                <span
                                  class="text-xs font-weight-bold text-dark me-2"
                                  style="white-space: nowrap"
                                  >[구체적 사유]</span
                                >
                                <input
                                  type="text"
                                  class="form-control form-control-sm border-dark-strong"
                                  v-model="
                                    extraInputs[sIdx][subIdx][qIdx].reason
                                  "
                                  placeholder="사유를 입력해주세요"
                                />
                              </div>
                              <div class="col-md-6 d-flex align-items-center">
                                <span
                                  class="text-xs font-weight-bold text-dark me-2"
                                  style="white-space: nowrap"
                                  >[필요시기]</span
                                >
                                <input
                                  type="date"
                                  class="form-control form-control-sm border-dark-strong"
                                  v-model="extraInputs[sIdx][subIdx][qIdx].date"
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

            <div class="mt-5">
              <div class="section-title-box mb-2">
                <div class="d-flex align-items-center">
                  <span class="dot-icon me-2">●</span>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    추가 요청사항
                  </h6>
                </div>
              </div>
              <div
                class="comment-container p-3 bg-white border-dark-1px border-radius-md"
              >
                <textarea
                  class="form-control border-0 bg-transparent text-dark no-resize shadow-none p-0"
                  rows="4"
                  v-model="additionalRequest"
                  placeholder="추가적으로 필요한 사항이나 요청 내용을 입력해주세요."
                ></textarea>
                <div class="text-end mt-2">
                  <span class="text-xs text-dark opacity-7">
                    {{ additionalRequest.length }} / 500
                  </span>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-center mt-5 mb-4">
              <button
                class="btn btn-success px-6 py-2-5 me-3 shadow-sm"
                @click="isModalOpen = true"
              >
                저장
              </button>
              <button
                class="btn btn-outline-secondary px-6 py-2-5 shadow-sm"
                @click="resetCancel"
              >
                취소
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
                >등록일 : {{ selectedUserInfo.formatDate }}</span
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
                            v-if="q.hasExtraInput"
                            class="mt-3 p-3 bg-light border-dark-strong extra-input-container"
                          >
                            <span class="text-success font-weight-bold"
                              >[구체적 사유]</span
                            >
                            {{
                              (extraInputs[sIdx] &&
                                extraInputs[sIdx][subIdx] &&
                                extraInputs[sIdx][subIdx][qIdx].reason) ||
                              "-"
                            }}
                            <span class="ms-2 text-success font-weight-bold"
                              >[필요시기]</span
                            >
                            {{
                              (extraInputs[sIdx] &&
                                extraInputs[sIdx][subIdx] &&
                                extraInputs[sIdx][subIdx][qIdx].date) ||
                              "-"
                            }}
                          </div>
                        </td>
                        <td class="text-center border-start align-middle">
                          <div
                            v-if="
                              answers[sIdx] &&
                              answers[sIdx][subIdx] &&
                              answers[sIdx][subIdx][qIdx] === '예'
                            "
                            class="selected-dot mx-auto"
                          ></div>
                        </td>
                        <td class="text-center border-start align-middle">
                          <div
                            v-if="
                              answers[sIdx] &&
                              answers[sIdx][subIdx] &&
                              answers[sIdx][subIdx][qIdx] === '아니오'
                            "
                            class="selected-dot mx-auto"
                          ></div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </template>

            <div class="mt-4 p-3 bg-light border-radius-md">
              <h6 class="text-sm font-weight-bold mb-2">추가 요청사항</h6>
              <p class="text-sm mb-0 text-dark">
                {{ additionalRequest || "입력된 내용이 없습니다." }}
              </p>
            </div>
          </div>

          <div
            class="modal-footer d-flex justify-content-center bg-white border-top py-3"
          >
            <button
              class="btn btn-success px-5 py-2 me-2 shadow-sm"
              @click="serveyAdd()"
            >
              등록
            </button>
            <button
              class="btn btn-outline-secondary px-5 py-2 shadow-sm"
              @click="isModalOpen = false"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useSurveyStore } from "../../store/survey";
import { useRouter } from "vue-router";

const router = useRouter();
const surveyStore = useSurveyStore();

const isModalOpen = ref(false);
const additionalRequest = ref("");
const uniqueUserList = ref([]);
const allSections = ref([]);
const answers = ref([]);
const extraInputs = ref([]);

const Ver_Id = ref("FORM0004");

//날짜 형식
const dateFormat = (dateVal) => {
  if (!dateVal) return "-";
  let newDate = new Date(dateVal);
  let year = newDate.getFullYear();
  let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
  let day = ("0" + newDate.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const selectedUserInfo = computed(() => {
  const user = uniqueUserList.value.find(
    (u) => u.support_id === surveyStore.selectedUserId,
  );

  const dateToFormat = user?.created_at || new Date();

  return {
    ...user,
    formatDate: dateFormat(dateToFormat),
  };
});

// 초기 답변 상태 생성 함수
const createInitialAnswers = () =>
  allSections.value.map((section) =>
    section.subs.map((sub) => new Array(sub.questions.length).fill(null)),
  );

//설문 문항
const fetchSurveyItems = async () => {
  try {
    const res = await fetch(`/api/survey/items/${Ver_Id.value}`);
    if (res.ok) {
      const rawData = await res.json();
      const grouped = [];

      rawData.forEach((item) => {
        let section = grouped.find(
          (s) => s.title === getSectionTitle(item.titleCode),
        );

        if (!section) {
          section = {
            title: getSectionTitle(item.titleCode),
            subs: [],
          };
          grouped.push(section);
        }

        let sub = section.subs.find(
          (sb) => sb.subTitle === (item.S_Name || "기본 항목"),
        );
        if (!sub) {
          sub = {
            subTitle: item.S_Name || "기본 항목",
            description: item.S_Desc || "지원이 필요한 서비스 항목입니다.",
            questions: [],
          };
          section.subs.push(sub);
        }

        sub.questions.push({
          id: item.question_id,
          text: item.question_text,
          hasExtraInput: item.use_yn === "Y",
        });
      });

      allSections.value = grouped;

      answers.value = allSections.value.map((section) =>
        section.subs.map((sub) => new Array(sub.questions.length).fill(null)),
      );

      extraInputs.value = allSections.value.map((section) =>
        section.subs.map((sub) =>
          sub.questions.map(() => ({ reason: "", date: "" })),
        ),
      );
    }
  } catch (err) {
    console.error("문항 로드 실패:", err);
  }
};

//취소 버튼 (리셋)
const resetCancel = () => {
  if (confirm("작성 내용을 초기화하시겠습니까?")) {
    answers.value = createInitialAnswers();
    extraInputs.value.forEach((section) => {
      section.forEach((sub) => {
        sub.forEach((q) => {
          q.reason = "";
          q.date = "";
        });
      });
    });
    additionalRequest.value = "";
  }
};

//조사지 등록
const serveyAdd = async () => {
  const selectedUser = uniqueUserList.value.find(
    (u) => u.support_id === surveyStore.selectedUserId,
  );

  if (!selectedUser) {
    alert("지원대상자를 선택해주세요.");
    return;
  }

  const flatAnswers = answers.value.flat(2);
  if (flatAnswers.includes(null)) {
    alert("작성하지 않은 문항이 있습니다.");
    return;
  }

  try {
    const idResponse = await fetch("/api/survey/newId");
    if (!idResponse.ok) throw new Error("새 아이디 생성 실패");
    const newJId = await idResponse.text();

    const flatAnswers = answers.value.flat(2);

    let data = {
      J_ID: newJId,
      Ver_Id: "FORM0004",
      G_UserId: selectedUser.G_UserId,
      support_id: selectedUser.support_id,
      result: null,
      reason: null,
      answerList: flatAnswers,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };

    let response = await fetch("/api/survey/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const answerResponse = await fetch("/api/survey/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          J_ID: data.J_ID,
          answerList: flatAnswers,
          extraInputs: extraInputs.value.flat(2),
        }),
      });

      if (answerResponse.ok) {
        alert("조사지 등록이 완료되었습니다.");
        router.push({ name: "userSurveySelect", params: { no: data.J_ID } });
      } else {
        alert("상세 답변 등록 중 오류가 발생했습니다.");
      }
    } else {
      alert("조사지 마스터 등록 실패");
    }
  } catch (err) {
    console.error("등록 중 에러 발생:", err);
    alert("오류가 발생했습니다: " + err.message);
  }
};

const getSectionTitle = (code) => {
  const titles = {
    T01: "지원사유",
    T02: "지원이 필요한 서비스",
    T03: "이용중인 복지 서비스",
  };
  return titles[code] || "기타 항목";
};

onMounted(async () => {
  try {
    const response = await fetch("/api/survey/support");
    if (response.ok) {
      uniqueUserList.value = await response.json();
    }
    await fetchSurveyItems();
  } catch (err) {
    console.error(err);
  }
});
</script>

<style scoped>
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
  top: 50%;
  transform: translate(-50%, -50%);
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

/* 추가 스타일: 이미지 2번 상세 입력창 */
.border-dark-thin {
  border: 1px solid #ffffff !important;
}

.extra-input-container {
  border-radius: 4px;
}

/* 이미지 1번: 하단 코멘트 영역 */
.comment-container {
  border: 1px solid #1a4713;
  border-radius: 8px;
}

.no-resize {
  resize: none;
}

.no-resize:focus {
  outline: none;
  box-shadow: none;
}

/* 모달 관련 스타일 */
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
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-scrollable {
  overflow-y: auto;
  flex: 1;
}

.selected-dot {
  width: 12px;
  height: 12px;
  background-color: #5dbe8a;
  border-radius: 50%;
}

.px-6 {
  padding-left: 3rem !important;
  padding-right: 3rem !important;
}

.py-2-5 {
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.border-dark-strong {
  border: 1px solid #000000 !important;
  background-color: #ffffff !important;
}

/* 포커스(클릭) 시에도 검은색 테두리 유지 */
.border-dark-strong:focus {
  border: 1px solid #000000 !important;
  box-shadow: none;
  background-color: #ffffff !important;
}

/* 박스 자체에 적용되는 스타일 */
.border-dark-1px {
  border: 1px solid #000000 !important;
}

/* 배경 흰색 강제 적용 */
.bg-white {
  background-color: #ffffff !important;
}

/* textarea 포커스 시 발생하는 파란색 테두리 방지 */
.shadow-none:focus {
  box-shadow: none !important;
  outline: none !important;
}

/* 내부 글자색 검정 */
.text-dark {
  color: #000000 !important;
}
</style>
