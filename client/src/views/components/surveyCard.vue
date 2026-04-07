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
                등록일 : {{ selectedUserInfo?.dateFormat || "-" }}
              </span>
            </div>
          </div>
        </div>

        <div class="card shadow-lg border-radius-top-none mb-5">
          <div class="card-body p-4 pt-5">
            <template v-for="(section, sIdx) in allSections" :key="sIdx">
              <div class="section-container mb-5">
                <div class="section-title-wrapper d-flex align-items-center mb-2">
                  <span class="dot-icon me-2">●</span>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ section.titleName }}
                  </h6>
                </div>

                <div class="table-responsive shadow-sm border-top-custom">
                  <table class="survey-main-table w-100">
                    <colgroup>
                      <col style="width: 50px" />
                      <col />
                      <col style="width: 70px" />
                      <col style="width: 70px" />
                    </colgroup>

                    <template v-for="(sub, subIdx) in section.subs" :key="subIdx">
                      <thead class="sub-group-header">
                        <tr>
                          <th colspan="2" class="text-start ps-3 py-2">
                            <span class="sub-title-text">{{ sub.subTitle }}</span>
                            <span
                              class="sub-desc-text ms-3 text-xs text-secondary font-weight-normal"
                            >
                              {{ sub.description }}
                            </span>
                          </th>
                          <th class="text-center text-sm border-start">예</th>
                          <th class="text-center text-sm border-start">아니오</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(q, qIdx) in sub.questions"
                          :key="qIdx"
                          class="question-row"
                        >
                          <td class="text-center question-no border-end">
                            {{ qIdx + 1 }}
                          </td>

                          <template v-if="q.hasExtraInput">
                            <td colspan="4" class="ps-3 py-3 text-start border-end">
                              <div class="text-sm font-weight-bold text-dark mb-2">
                                {{
                                  typeof q === "string" ? q : q.question_text || q.text
                                }}
                              </div>
                              <div class="extra-input-wrapper w-100">
                                <textarea
                                  v-if="q.hasExtraInput"
                                  v-model="q.extra_reason"
                                  class="form-control"
                                  placeholder="사유를 입력해주세요."
                                ></textarea>
                              </div>
                            </td>
                          </template>

                          <template v-else>
                            <td class="ps-3 py-3 text-start border-end">
                              <div class="text-sm font-weight-bold text-dark">
                                {{
                                  typeof q === "string" ? q : q.question_text || q.text
                                }}
                              </div>
                            </td>
                            <td class="text-center border-end align-middle">
                              <input
                                type="radio"
                                :name="`q_${sIdx}_${subIdx}_${qIdx}`"
                                value="예"
                                v-model="answers[sIdx][subIdx][qIdx]"
                                class="form-check-input custom-radio"
                              />
                            </td>
                            <td class="text-center align-middle">
                              <input
                                type="radio"
                                :name="`q_${sIdx}_${subIdx}_${qIdx}`"
                                value="아니오"
                                v-model="answers[sIdx][subIdx][qIdx]"
                                class="form-check-input custom-radio"
                              />
                            </td>
                          </template>
                        </tr>
                      </tbody>
                    </template>
                  </table>
                </div>
              </div>
            </template>

            <div class="mt-5">
              <div class="section-title-box mb-2">
                <div class="d-flex align-items-center">
                  <span class="dot-icon me-2">●</span>
                  <h6 class="mb-0 font-weight-bolder text-dark">추가 요청사항</h6>
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
                class="btn btn-outline-secondary px-6 py-2-5 shadow-sm"
                @click="goBack"
              >
                이전
              </button>
              <button
                class="btn btn-outline-secondary px-6 py-2-5 shadow-sm"
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
            <h5 class="mb-0 font-weight-bolder text-white">조사지 신청 내용 확인</h5>
            <div class="date-center">
              <span class="text-white text-sm font-weight-bold opacity-9">
                등록일 : {{ selectedUserInfo?.dateFormat || "-" }}
              </span>
            </div>
          </div>

          <div class="card-body modal-scrollable p-4 bg-white">
            <template v-for="(section, sIdx) in allSections" :key="'m' + sIdx">
              <div class="section-title-box mb-3" :class="{ 'mt-4': sIdx > 0 }">
                <div class="d-flex align-items-center">
                  <span class="dot-icon me-2">●</span>
                  <h6 class="mb-0 font-weight-bolder text-dark">
                    {{ section.titleName }}
                  </h6>
                </div>
              </div>

              <div class="table-responsive mb-4">
                <table class="table align-items-center mb-0 custom-bordered-table">
                  <tbody>
                    <template v-for="(sub, subIdx) in section.subs" :key="'ms' + subIdx">
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
                          {{ sub.description || "" }}
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
                          v-if="q.hasExtraInput"
                          colspan="4"
                          class="text-sm text-dark text-wrap py-3 ps-3 align-middle"
                        >
                          <div class="mb-2 font-weight-bold">
                            {{ q.question_text || q.text }}
                          </div>

                          <div
                            class="p-3 bg-light border-radius-md border"
                            style="white-space: pre-wrap"
                          >
                            {{ q.extra_reason || "입력된 내용이 없습니다." }}
                          </div>
                        </td>

                        <template v-else>
                          <td class="text-sm text-dark text-wrap py-2 ps-3 align-middle">
                            {{ q.question_text || q.text }}
                          </td>
                          <td
                            class="text-center border-start align-middle"
                            style="width: 70px"
                          >
                            <div
                              v-if="answers[sIdx]?.[subIdx]?.[qIdx] === '예'"
                              class="selected-dot mx-auto"
                            ></div>
                          </td>
                          <td
                            class="text-center border-start align-middle"
                            style="width: 70px"
                          >
                            <div
                              v-if="answers[sIdx]?.[subIdx]?.[qIdx] === '아니오'"
                              class="selected-dot mx-auto"
                            ></div>
                          </td>
                        </template>
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
            <button class="btn btn-success px-5 py-2 me-2 shadow-sm" @click="serveyAdd()">
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
import { watch } from "vue";

const router = useRouter();
const surveyStore = useSurveyStore();
const extraRequestQuestionId = ref("");
const isModalOpen = ref(false);
const additionalRequest = ref("");
const uniqueUserList = ref([]);
const allSections = ref([]);
const answers = ref([]);
const extraInputs = ref([]);

const props = defineProps({
  verId: {
    type: String,
    default: "FORM0004",
  },
});
console.log("props", props);
const newVerId = ref("");
const Ver_Id = computed(() => props.verId);

console.log("Ver_Id", Ver_Id);

const getSectionTitle = (code) => {
  if (!code) return { code: "ETC", name: "기타 항목" };

  const cleanCode = String(code).trim();

  const prefix = cleanCode.substring(0, 3);

  const titles = {
    T01: "지원사유",
    T02: "지원이 필요한 서비스",
    T03: "이용중인 복지 서비스",
    T04: "새로운 설문 항목",
  };

  return {
    code: prefix,
    name: titles[prefix] || "기타 항목",
  };
};

//날짜 형식
const dateFormat = (dateVal) => {
  if (!dateVal) return "-";
  let newDate = new Date(dateVal);
  let year = newDate.getFullYear();
  let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
  let day = ("0" + newDate.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

// 초기 답변 상태 생성 함수
const createInitialAnswers = () =>
  allSections.value.map((section) =>
    section.subs.map((sub) =>
      sub.questions.map((q) => {
        // 타입이 체크박스면 초기값을 빈 배열[]로, 나머지는 null로 설정
        return q.input_type === "checkbox" ? [] : null;
      })
    )
  );

//설문 문항
// const fetchSurveyItems = async (Ver_Id) => {
//   try {
//     newVerId.value = Ver_Id;
//     const res = await fetch(`/api/survey/items/${Ver_Id}`);
//     if (res.ok) {
//       const rawData = await res.json();
//       // console.log(`${Ver_Id.value} 문항 로드 완료`);
//       console.log(rawData);
//       const grouped = [];

//       rawData.forEach((item) => {
//         const sInfo = getSectionTitle(item.titleCode);
//         let section = grouped.find((s) => s.titleCode === sInfo.code);

//         if (!section) {
//           section = {
//             titleCode: sInfo.code,
//             titleName: sInfo.name,
//             subs: [],
//           };
//           grouped.push(section);
//         }

//         const currentSubTitle = item.S_Name || "기본 항목";
//         let sub = section.subs.find((sb) => sb.subTitle === currentSubTitle);

//         if (!sub) {
//           let displayDesc = "";
//           if (sInfo.code === "T001") {
//             displayDesc = "지원이 필요한 서비스 항목입니다.";
//           } else {
//             displayDesc = item.S_Desc || "";
//           }

//           sub = {
//             subTitle: currentSubTitle,
//             description: displayDesc,
//             questions: [],
//           };
//           section.subs.push(sub);
//         }

//         const isEmergencySection = item.titleCode === "T010";
//         const isQuestionTwo = String(item.question_text) === "2";

//         if (isEmergencySection && isQuestionTwo) {
//           item.hasExtraInput = true;
//         } else {
//           item.hasExtraInput = false;
//         }

//         sub.questions.push(item);
//       });

//       allSections.value = grouped;

//       answers.value = allSections.value.map((section) =>
//         section.subs.map((sub) => new Array(sub.questions.length).fill(null))
//       );

//       extraInputs.value = allSections.value.map((section) =>
//         section.subs.map((sub) => sub.questions.map(() => ({ reason: "", date: "" })))
//       );
//     }
//   } catch (err) {
//     console.error("문항 로드 실패:", err);
//   }
// };
const fetchSurveyItems = async (Ver_Id) => {
  try {
    newVerId.value = Ver_Id;
    extraRequestQuestionId.value = "";

    const res = await fetch(`/api/survey/items/${Ver_Id}`);
    if (res.ok) {
      const rawData = await res.json();
      console.log("survey items rawData:", rawData);

      const grouped = [];

      rawData.forEach((item) => {
        if (item.titleCode === "T004") {
          extraRequestQuestionId.value = item.question_id;
          return;
        }

        const sInfo = getSectionTitle(item.titleCode);
        let section = grouped.find((s) => s.titleCode === sInfo.code);

        if (!section) {
          section = {
            titleCode: sInfo.code,
            titleName: sInfo.name,
            subs: [],
          };
          grouped.push(section);
        }

        const currentSubTitle = item.S_Name || "기본 항목";
        let sub = section.subs.find((sb) => sb.subTitle === currentSubTitle);

        if (!sub) {
          let displayDesc = "";
          if (sInfo.code === "T001") {
            displayDesc = "지원이 필요한 서비스 항목입니다.";
          } else {
            displayDesc = item.S_Desc || "";
          }

          sub = {
            subTitle: currentSubTitle,
            description: displayDesc,
            questions: [],
          };
          section.subs.push(sub);
        }

        const isEmergencySection = item.titleCode === "T010";
        const isQuestionTwo = String(item.question_text) === "2";

        item.hasExtraInput = isEmergencySection && isQuestionTwo;

        sub.questions.push(item);
      });

      allSections.value = grouped;

      answers.value = allSections.value.map((section) =>
        section.subs.map((sub) => new Array(sub.questions.length).fill(null))
      );

      extraInputs.value = allSections.value.map((section) =>
        section.subs.map((sub) =>
          sub.questions.map(() => ({ reason: "", date: "" }))
        )
      );

      console.log("extraRequestQuestionId:", extraRequestQuestionId.value);
      console.log(
        "일반 질문 개수:",
        allSections.value.flatMap((s) => s.subs).flatMap((sub) => sub.questions).length
      );
    }
  } catch (err) {
    console.error("문항 로드 실패:", err);
  }
};

//조사지 등록
// const serveyAdd = async () => {
//   const selectedUser = uniqueUserList.value.find(
//     (u) => u.support_id === surveyStore.selectedUserId
//   );

//   if (!selectedUser) {
//     alert("지원대상자를 선택해주세요.");
//     return;
//   }

//   //답변 담는 함수
//   const finalAnswerList = [];
//   allSections.value.forEach((section, sIdx) => {
//     section.subs.forEach((sub, subIdx) => {
//       sub.questions.forEach((q, qIdx) => {
//         if (q.hasExtraInput) {
//           finalAnswerList.push(q.extra_reason || "");
//         } else {
//           const val = answers.value[sIdx][subIdx][qIdx];
//           finalAnswerList.push(val || "");
//         }
//       });
//     });
//   });

//   // 답변 필수 체크
//   const isAllAnswered = allSections.value.every((section, sIdx) => {
//     return section.subs.every((sub, subIdx) => {
//       return sub.questions.every((q, qIdx) => {
//         if (q.hasExtraInput) {
//           return q.extra_reason && q.extra_reason.trim().length > 0;
//         } else {
//           return (
//             answers.value[sIdx][subIdx][qIdx] !== null &&
//             answers.value[sIdx][subIdx][qIdx] !== ""
//           );
//         }
//       });
//     });
//   });

//   if (!isAllAnswered) {
//     console.log("현재 수집된 답변 리스트:", finalAnswerList);
//     alert("작성하지 않은 문항이 있습니다.");
//     return;
//   }

//   try {
//     const idResponse = await fetch("/api/survey/newId");
//     if (!idResponse.ok) throw new Error("새 아이디 생성 실패");
//     const newJId = await idResponse.text();

//     //추가 요청 사항
//     const safeRequest = additionalRequest.value
//       ? additionalRequest.value.replace(/,/g, " ")
//       : "";

//     finalAnswerList.push(safeRequest);

//     let data = {
//       J_ID: newJId,
//       // Ver_Id: Ver_Id.value,
//       Ver_Id : newVerId.value,
//       G_UserId: selectedUser.G_UserId,
//       support_id: selectedUser.support_id,
//       result: null,
//       reason: null,
//       answerList: finalAnswerList,
//       created_at: new Date().toISOString().split("T")[0],
//       updated_at: new Date().toISOString().split("T")[0],
//     };

//     let response = await fetch("/api/survey/add", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       const answerResponse = await fetch("/api/survey/answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           J_ID: data.J_ID,
//           answerList: finalAnswerList,
//           extraInputs: extraInputs.value.flat(2),
//         }),
//       });

//       if (answerResponse.ok) {
//         alert("조사지 등록이 완료되었습니다.");
//         surveyStore.selectedUserId = "";
//         router.push({ name: "userSurveySelect", params: { id: data.J_ID } });
//       } else {
//         alert("상세 답변 등록 중 오류가 발생했습니다.");
//       }
//     } else {
//       alert("조사지 등록 실패");
//     }
//   } catch (err) {
//     console.error("등록 중 에러 발생:", err);
//     alert("오류가 발생했습니다: " + err.message);
//   }
// };



const serveyAdd = async () => {
  const selectedUser = uniqueUserList.value.find(
    (u) => u.support_id === surveyStore.selectedUserId
  );

  if (!selectedUser) {
    alert("지원대상자를 선택해주세요.");
    return;
  }

  const isAllAnswered = allSections.value.every((section, sIdx) => {
    return section.subs.every((sub, subIdx) => {
      return sub.questions.every((q, qIdx) => {
        if (q.hasExtraInput) {
          return q.extra_reason && q.extra_reason.trim().length > 0;
        } else {
          return (
            answers.value[sIdx][subIdx][qIdx] !== null &&
            answers.value[sIdx][subIdx][qIdx] !== ""
          );
        }
      });
    });
  });

  if (!isAllAnswered) {
    alert("작성하지 않은 문항이 있습니다.");
    return;
  }

  const finalAnswerList = [];

  allSections.value.forEach((section, sIdx) => {
    section.subs.forEach((sub, subIdx) => {
      sub.questions.forEach((q, qIdx) => {
        let answerValue = "";

        if (q.hasExtraInput) {
          answerValue = q.extra_reason || "";
        } else {
          answerValue = answers.value[sIdx][subIdx][qIdx] || "";
        }

        finalAnswerList.push({
          question_id: q.question_id,
          answer: answerValue,
        });
      });
    });
  });

  const safeRequest = additionalRequest.value
    ? additionalRequest.value.replace(/,/g, " ")
    : "";

  if (extraRequestQuestionId.value) {
    finalAnswerList.push({
      question_id: extraRequestQuestionId.value,
      answer: safeRequest,
    });
  }

  console.log("extraRequestQuestionId:", extraRequestQuestionId.value);
  console.log("additionalRequest:", additionalRequest.value);
  console.log("finalAnswerList:", finalAnswerList);

  try {
    const idResponse = await fetch("/api/survey/newId");
    if (!idResponse.ok) throw new Error("새 아이디 생성 실패");
    const newJId = await idResponse.text();

    const data = {
      J_ID: newJId,
      Ver_Id: newVerId.value,
      G_UserId: selectedUser.G_UserId,
      support_id: selectedUser.support_id,
      result: null,
      reason: null,
      answerList: finalAnswerList,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };

    const response = await fetch("/api/survey/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      alert("조사지 등록 실패");
      return;
    }

    const answerResponse = await fetch("/api/survey/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        J_ID: data.J_ID,
        answerList: finalAnswerList,
      }),
    });

    if (answerResponse.ok) {
      alert("조사지 등록이 완료되었습니다.");
      surveyStore.selectedUserId = "";
      router.push({ name: "userSurveySelect", params: { id: data.J_ID } });
    } else {
      alert("상세 답변 등록 중 오류가 발생했습니다.");
    }
  } catch (err) {
    console.error("등록 중 에러 발생:", err);
    alert("오류가 발생했습니다: " + err.message);
  }
};

watch(
  () => props.verId,
  async (newVal) => {
    console.log("폼 버전 변경 감지:", newVal);
    if (newVal) {
      await fetchSurveyItems(newVal);
    }
  },
  { immediate: true }
);

const selectedUserInfo = computed(() => {
  const user = uniqueUserList.value.find(
    (u) => u.support_id === surveyStore.selectedUserId
  );

  return {
    ...user,
    support_name: user?.support_name || user?.userName || "대상자",
    dateFormat: dateFormat(user?.created_at || user?.reg_date || new Date()),
  };
});

onMounted(async () => {
  try {
    const version = await fetch("/api/survey/getversion")
      .then((resp) => resp.json())
      .catch((err) => console.log(err));

    if (version.status === "Success") {
      console.log(version.data[0].Ver_Id);
      await fetchSurveyItems(version.data[0].Ver_Id);
    }

    const response = await fetch("/api/survey/support");
    if (response.ok) uniqueUserList.value = await response.json();
    // await fetchSurveyItems(Ver_Id);
  } catch (err) {
    console.error(err);
  }
});

const goBack = () => {
  router.push({ name: "userMain" });
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
    surveyStore.selectedUserId = "";
  }
};
</script>

<style scoped>
/* 조회 페이지의 테이블 스타일 적용 */
.survey-main-table {
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-collapse: collapse;
}
.survey-main-table th,
.survey-main-table td {
  border: 1px solid #dee2e6;
  padding: 8px 10px;
}
.sub-group-header {
  background-color: #f8fafd;
}
.sub-title-text {
  color: #2dce89;
  font-weight: 800;
  font-size: 0.9rem;
}
.border-top-custom {
  border-top: 2px solid #333;
}
.custom-radio {
  cursor: pointer;
}
/* 기존 스타일 유지 */
.survey-view-page {
  font-family: "Noto Sans KR", sans-serif;
  background-color: #f8f9fa;
}
.header-bg {
  background-color: #5dbe8a !important;
  border-radius: 12px 12px 0 0;
}
.dot-icon {
  color: #2dce89;
}
.no-resize {
  resize: none;
}

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

/* 인풋 박스의 너비를 적절하게 제한 */
.custom-input-width {
  width: 200px !important; /* 사유 입력창 너비 */
}

.custom-date-width {
  width: 150px !important; /* 날짜 선택창 너비 */
}

/* 추가 입력창 컨테이너의 테두리와 여백 조정 */
.extra-input-container {
  border: 1px solid #000 !important; /* 첫 번째 이미지처럼 검정 테두리 */
  background-color: #fff !important; /* 배경은 흰색 */
  display: inline-block; /* 내용물만큼만 너비 차지 (선택 사항) */
  padding: 10px 15px !important;
}

/* 간격 조절을 위한 유틸리티 (Bootstrap 5 미지원 시) */
.gap-3 {
  gap: 1rem;
}

/* 기존 .custom-input-width를 아래와 같이 변경하거나 추가 */
.custom-textarea-full {
  width: 100% !important;
  resize: none; /* 사용자가 임의로 크기 조절하는 것을 막고 싶을 때 */
  padding: 12px !important;
  line-height: 1.5;
  border-radius: 8px !important; /* 이미지처럼 둥근 느낌을 주려면 추가 */
}
/* 부모 컨테이너가 테이블 셀 안에서 가득 차도록 설정 */
.extra-input-container {
  /* border: 1px solid #000 !important;  <-- 이 부분을 삭제하거나 아래처럼 수정 */
  border: none !important;
  background-color: #f8f9fa !important; /* 연한 회색 배경 유지 혹은 투명하게 */
  padding: 10px 0 !important; /* 테두리가 없으므로 좌우 패딩을 줄여 정렬 맞춤 */
  width: 100%;
}

/* d-flex align-items-center와 함께 사용하여 인풋이 밀리지 않게 조절 */
.flex-grow-1 {
  flex-grow: 1 !important;
}

/* 버튼 간격 */
button.btn {
  margin: 0 10px; /* 좌우 간격 */
}

/* 기본 상태: 초록 테두리 + 초록 글자 */
.btn-outline-secondary {
  border-color: #5dbe8a !important;
  color: #5dbe8a !important;
}

/* hover 상태 */
.btn-outline-secondary:hover {
  background-color: #5dbe8a !important;
  color: #ffffff !important;
  border-color: #ffffff !important;
}
</style>
