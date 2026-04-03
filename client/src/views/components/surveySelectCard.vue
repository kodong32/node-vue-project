<template>
  <div class="py-4 container-fluid survey-view-page">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11">
        <div class="survey-header-container mb-4">
          <div
            class="d-flex align-items-center p-3 px-4 text-white header-bg shadow-sm"
          >
            <h5 class="mb-0 font-weight-bolder text-white">
              <i class="ni ni-paper-diploma me-2"></i>
              {{ userName }}님 설문 결과 조회
            </h5>
            <div class="ms-auto text-sm font-weight-bold">
              등록일 : {{ dateFormat(createdAt) }}
            </div>
          </div>
        </div>

        <template v-for="(section, sIdx) in groupedSections" :key="sIdx">
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
                        {{ q.question_no }}
                      </td>
                      <td class="ps-3 py-3 text-start border-end">
                        <div class="text-sm font-weight-bold text-dark">
                          {{ q.question_text }}
                        </div>
                      </td>
                      <td class="text-center border-end align-middle">
                        <div
                          class="check-box-square mx-auto"
                          :class="{ 'is-checked': q.answer === '예' }"
                        >
                          <i
                            v-if="q.answer === '예'"
                            class="fa fa-check text-xs"
                          ></i>
                        </div>
                      </td>
                      <td class="text-center align-middle">
                        <div
                          class="check-box-square mx-auto"
                          :class="{ 'is-checked': q.answer === '아니오' }"
                        >
                          <i
                            v-if="q.answer === '아니오'"
                            class="fa fa-check text-xs"
                          ></i>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </table>
            </div>
          </div>
        </template>

        <div class="d-flex justify-content-center mt-5 mb-5">
          <RouterLink to="/user" class="btn btn-dark px-6 shadow-sm"
            >목록으로 돌아가기</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const surveyData = ref([]); // 서버에서 받아온 문항 데이터
const userName = ref("");
const createdAt = ref("");
const allTitles = ref([]);

//타이틀 매핑 -> 서버 데이터를 (Section > Sub > Question)로 변환
const getTitleByCode = (code) => {
  if (!code || allTitles.value.length === 0) return null;

  const cleanCode = String(code).trim().toUpperCase();
  const found = allTitles.value.find(
    (t) => String(t.titleCode).trim().toUpperCase() === cleanCode,
  );

  return found || null;
};
//데이터 대 -> 중 구조로 변환
const groupedSections = computed(() => {
  const sections = [];

  surveyData.value.forEach((item) => {
    const currentTitleInfo = getTitleByCode(item.titleCode);

    const parentCode = currentTitleInfo?.parentCode || item.titleCode;
    const parentInfo = getTitleByCode(parentCode);

    //대분류
    let section = sections.find((s) => s.titleCode === parentCode);
    if (!section) {
      section = {
        titleCode: parentCode,
        titleName: parentInfo ? parentInfo.title : "기타 항목",
        subs: [],
      };
      sections.push(section);
    }

    //중분류
    const subTitleName = currentTitleInfo
      ? currentTitleInfo.title
      : "기본 항목";
    let sub = section.subs.find((s) => s.subTitle === subTitleName);
    if (!sub) {
      sub = {
        subTitle: subTitleName,
        description: "",
        questions: [],
      };
      section.subs.push(sub);
    }

    sub.questions.push(item);
  });

  return sections;
});

//타이틀 정보
const fetchTitles = async () => {
  try {
    const response = await fetch("http://localhost:3000/survey/title", {
      credentials: "include",
    });
    if (!response.ok) throw new Error("타이틀 로드 실패");
    allTitles.value = await response.json();
    console.log("타이틀:", allTitles.value);
  } catch (error) {
    console.error(error);
  }
};

//조사지 건별조회 데이터 가져오기
const getSurveyDetail = async (id) => {
  try {
    const response = await fetch(`/api/survey/surveySelect/${id}`, {
      credentials: "include",
    });

    if (response.status === 403) {
      alert("권한이 없습니다.");
      router.push("/user");
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("서버 응답이 배열이 아닙니다:", data);
      surveyData.value = [];
      return;
    }

    if (data.length > 0) {
      userName.value = data[0].userName;
      createdAt.value = data[0].created_at;
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
};

//조사지 답변 데이터
const fetchAnswers = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/survey/answerSelect/${id}`,
      { credentials: "include" },
    );
    if (!response.ok) throw new Error("답변 로드 실패");
    const answerData = await response.json();
    console.log("답변데이터:", answerData);

    surveyData.value.forEach((q, idx) => {
      if (answerData.length > 0 && answerData[0].answer) {
        const ansArray = answerData[0].answer.split(",");
        q.answer = ansArray[idx];
      }
      // console.log(surveyData.value.map((q) => q.question_no + ":" + q.answer));
    });
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchTitles();

  const id = route.params.id;
  if (id) {
    await getSurveyDetail(id);
    await fetchAnswers(id);
  }
});

//날짜 형식
const dateFormat = (dateVal) => {
  if (!dateVal) return "-";

  let newDate = new Date(dateVal);
  let year = newDate.getFullYear();
  let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
  let day = ("0" + newDate.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};
</script>

<style scoped>
.survey-main-table th,
.survey-main-table td {
  border: 1px solid #dee2e6; /* 위/아래/좌/우 모두 선 */
  padding: 8px 10px;
}

.survey-main-table td:nth-child(3),
.survey-main-table td:nth-child(4) {
  text-align: center;
}

.survey-view-page {
  font-family: "Noto Sans KR", sans-serif;
  background-color: #f8f9fa;
}

.header-bg {
  background-color: #5dbe8a !important;
  border-radius: 12px 12px 0 0;
  height: 60px;
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

.status-box {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  color: #adb5bd;
  background: #f1f3f5;
  border: 1px solid #e9ecef;
}

.dot-icon {
  color: #2dce89;
  font-size: 14px;
}

.section-title-box {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
}

.custom-bordered-table {
  border: 1px solid #dee2e6;
  border-collapse: collapse;
}

.bg-light-green {
  background-color: #f0f9f4 !important;
}

.sub-header-row {
  border-top: 2px solid #495057;
}

.sub-header {
  background-color: #f8fafd;
  border-bottom: 1px solid #e9ecef;
}

.selected-indicator {
  width: 22px;
  height: 22px;
  border: 2px solid #e9ecef;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-indicator.active {
  border-color: #2dce89;
}

.inner-dot {
  width: 10px;
  height: 10px;
  background-color: #2dce89;
  border-radius: 50%;
}

.sub-header-row td {
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

.border-dark-strong {
  border: 1px solid #dee2e6 !important;
}

.btn-list-back {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-list-back:hover {
  background-color: #5a6268;
  color: white;
  transform: translateY(-1px);
}

.text-wrap {
  word-break: keep-all;
  line-height: 1.6;
}

.border-start {
  border-left: 1px solid #dee2e6 !important;
}

.survey-main-table {
  background-color: #fff;
  border: 1px solid #333;
  border-collapse: collapse;
}

.check-box-square i {
  color: #fff; /* 체크 표시 흰색 */
  font-size: 12px;
}

.check-box-square {
  width: 18px;
  height: 18px;
  border: 1px solid #888;
  border-radius: 50%; /* 동그라미 */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.check-box-square.is-checked {
  background-color: #2dce89; /* 선택 시 녹색 배경 */
  border-color: #2dce89;
}
</style>
