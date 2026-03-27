<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-lg mb-4">
          <div class="card-header pb-0 p-4">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0 font-weight-bolder text-info">조사지 형식 만들기</h6>
              <div class="d-flex align-items-center">
                <span class="text-sm me-2 text-secondary font-weight-bold">작성일</span>
                <div class="date-display p-2 bg-light border-radius-md border">
                  <span class="text-xs font-weight-bold">{{ today }}</span>
                </div>
              </div>
            </div>
            <button class="btn btn-outline-primary w-15" @click="loadPrevVersion()">이전버전 불러오기</button>
          </div>

          <div class="card-body p-4">
            <div class="mb-4">
              <label class="form-control-label text-sm">버전</label>
              <input
                type="text"
                class="form-control"
                v-model="version"
              />
            </div>

            <div class="mb-4">
              <label class="form-control-label text-sm">버전 상세설명</label>
              <textarea
                class="form-control"
                rows="3"
                placeholder="버전 상세설명을 입력하세요"
                v-model="versionDesc"
              ></textarea>
            </div>
            <template v-for="(section, sIdx) in allSections" :key="sIdx">
              <div
                class="d-flex justify-content-between align-items-center mb-4 p-3 bg-gray-100 border-radius-lg"
                :class="{ 'mt-5': sIdx > 0 }"
              >
                <div class="d-flex align-items-center">
                  <span class="text-success me-2">●</span>
                  <span class="text-sm font-weight-bolder">{{ section.title }}</span>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table align-items-center mb-0 border-top">
                  <thead>
                    <tr class="bg-light">
                      <th class="ps-4 text-sm font-weight-bolder">설문 항목</th>
                    </tr>
                  </thead>

                  <tbody>
                    <template v-for="(sub, subIdx) in section.subs" :key="subIdx">
                      <tr class="bg-gray-100">
                        <td
                          class="py-2 ps-4 text-xs font-weight-bold text-info text-uppercase"
                        >
                          <div class="d-flex justify-content-between align-items-center">
                            <div>
                              {{ sub.subTitle }}
                              <span
                                v-if="sub.description"
                                class="ms-2 font-weight-normal text-secondary text-lowercase"
                              >
                                {{ sub.description }}
                              </span>
                            </div>

                            <button
                              type="button"
                              class="btn btn-sm btn-primary mb-0"
                              @click="addInput(sub)"
                            >
                              추가
                            </button>
                          </div>

                          <div v-if="sub.inputs.length > 0" class="mt-3">
                            <div
                              v-for="(item, inputIdx) in sub.inputs"
                              :key="inputIdx"
                              class="mb-3 p-3 bg-white border border-radius-sm"
                            >
                              <div class="d-flex flex-column gap-3">
                                <div class="d-flex align-items-center gap-3 flex-wrap">
                                  <input
                                    type="text"
                                    class="form-control question-input"
                                    :placeholder="`${sub.subTitle} 내용 입력 ${
                                      inputIdx + 1
                                    }`"
                                    v-model="item.text"
                                  />

                                  <select
                                    class="form-select answer-select"
                                    v-model="item.answerType"
                                  >
                                    <option value="e001">예/아니오</option>
                                    <option value="e002">장문형</option>
                                  </select>

                                  <button
                                    type="button"
                                    class="btn btn-sm btn-danger mb-0"
                                    @click="removeInput(sub, inputIdx)"
                                  >
                                    삭제
                                  </button>
                                </div>

                                <div class="preview-box">
                                  <div class="text-xs text-secondary mb-2">
                                    답변형식 미리보기
                                  </div>

                                  <div
                                    v-if="item.answerType === 'e001'"
                                    class="d-flex align-items-center gap-4"
                                  >
                                    <div class="form-check mb-0">
                                      <input
                                        class="form-check-input"
                                        type="radio"
                                        disabled
                                      />
                                      <label class="form-check-label text-sm mb-0"
                                        >예</label
                                      >
                                    </div>
                                    <div class="form-check mb-0">
                                      <input
                                        class="form-check-input"
                                        type="radio"
                                        disabled
                                      />
                                      <label class="form-check-label text-sm mb-0"
                                        >아니오</label
                                      >
                                    </div>
                                  </div>

                                  <div v-else-if="item.answerType === 'e002'">
                                    <textarea
                                      class="form-control"
                                      rows="3"
                                      placeholder="장문형 입력란"
                                      disabled
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
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
                readonly
              ></textarea>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button class="btn btn-success me-2" @click="openModal">저장</button>
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
              <h5 class="mb-0 font-weight-bolder">조사지 형식 확인</h5>
              <div class="text-end">
                <span class="text-xs text-secondary d-block">작성일</span>
                <span class="text-xs font-weight-bold">{{ today }}</span>
              </div>
            </div>
          </div>

          <div class="card-body modal-scrollable p-4">
            <div class="mb-4 p-3 bg-light border-radius-md border">
              <div class="row">
                <div class="col-md-4 mb-3">
                  <div class="text-xs text-secondary mb-1">버전</div>
                  <div class="text-sm font-weight-bold">
                    {{ version || "-" }}
                  </div>
                </div>

                <div class="col-md-4 mb-3">
                  <div class="text-xs text-secondary mb-1">작성일</div>
                  <div class="text-sm font-weight-bold">
                    {{ today }}
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="text-xs text-secondary mb-1">버전 상세설명</div>
                  <div class="text-sm font-weight-bold version-desc-box">
                    {{ versionDesc || "입력 사항 없음" }}
                  </div>
                </div>
              </div>
            </div>
            <template v-for="(section, sIdx) in allSections" :key="'m' + sIdx">
              <div class="mb-3 mt-2 font-weight-bolder text-sm">
                <span class="text-success me-2">●</span> {{ section.title }}
              </div>

              <table class="table align-items-center mb-4 border">
                <thead class="bg-light">
                  <tr>
                    <th class="ps-3 text-xs font-weight-bold">설문 항목</th>
                  </tr>
                </thead>

                <tbody>
                  <template v-for="(sub, subIdx) in section.subs" :key="'ms' + subIdx">
                    <tr class="bg-gray-100">
                      <td class="ps-3 py-2 text-xxs font-weight-bolder text-info">
                        <div>
                          {{ sub.subTitle }}
                          <span
                            v-if="sub.description"
                            class="ms-2 font-weight-normal text-secondary text-lowercase"
                          >
                            {{ sub.description }}
                          </span>
                        </div>

                        <div v-if="sub.inputs.length > 0" class="mt-3">
                          <div
                            v-for="(item, inputIdx) in sub.inputs"
                            :key="'preview' + inputIdx"
                            class="mb-2 p-2 bg-white border border-radius-sm text-dark"
                          >
                            <div
                              class="d-flex justify-content-between align-items-center flex-wrap gap-2"
                            >
                              <div>
                                {{ item.text || `(문항 내용 없음 ${inputIdx + 1})` }}
                              </div>

                              <div class="text-sm text-secondary">
                                답변형식 :
                                <span v-if="item.answerType === 'e001'">예 / 아니오</span>
                                <span v-else-if="item.answerType === 'e002'">장문형</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </template>

            <div class="mt-3 border-top pt-3">
              <h6 class="text-sm font-weight-bolder text-secondary">● 추가 요청사항</h6>
              <div class="p-3 bg-light border-radius-md text-sm min-vh-10">
                {{ extraRequest }}
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { onBeforeMount } from "vue";

const router = useRouter();

const version = ref("");
const versionDesc = ref("");

const now = new Date();
const today = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
  2,
  "0"
)}.${String(now.getDate()).padStart(2, "0")}`;

const allSections = ref([
  {
    title: "지원사유",
    subs: [
      {
        titleCode: "T010",
        subTitle: "긴급 지원 필요",
        description: "즉시 지원인식 및 서비스 필요",
        inputs: [],
      },
      {
        titleCode: "T011",
        subTitle: "중점 지원 필요",
        description: "즉시 지원인식 및 서비스 필요",
        inputs: [],
      },
      {
        titleCode: "T012",
        subTitle: "계획 수립 필요",
        description: "즉시 지원인식 및 서비스 필요",
        inputs: [],
      },
    ],
  },
  {
    title: "지원이 필요한 서비스",
    subs: [
      {
        titleCode: "T020",
        subTitle: "개인별 지원",
        inputs: [],
      },
      {
        titleCode: "T021",
        subTitle: "교통",
        inputs: [],
      },
    ],
  },
  {
    title: "이용중인 복지 서비스",
    subs: [
      {
        titleCode: "T030",
        subTitle: "생활안정",
        inputs: [],
      },
      {
        titleCode: "T031",
        subTitle: "고용",
        inputs: [],
      },
    ],
  },
]);

const extraRequest = ref("");
const isModalOpen = ref(false);

const addInput = (sub) => {
  sub.inputs.push({
    text: "",
    answerType: "e001",
  });
};

const removeInput = (sub, index) => {
  sub.inputs.splice(index, 1);
};

const bindPrevVersionToSections = (rows) => {
  allSections.value.forEach((section) => {
    section.subs.forEach((sub) => {
      sub.inputs = [] ;
    })
  });

  rows.forEach((row) => {
    allSections.value.forEach((section) => {
      section.subs.forEach((sub) => {
        if(sub.titleCode === row.titleCode){
          sub.inputs.push({
            text : row.question_text || "",
            answerType : row.answer_type || "e001",
            questionNo : row.question_no || 0,
          });
        }
      });
    });
  });
  
  allSections.value.forEach((section) => {
    section.subs.forEach((sub) => {
      sub.inputs.sort((a,b) => a.questionNo - b.questionNo);
    });
  });
};

const loadPrevVersion = async () => {
  try{
    let result = await fetch(`/api/admin/surveyCurrent`)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
    
    if(result.status === "Success"){
      const rows = result.data;
      
      if(!rows || rows.length === 0){
        alert('현재 사용중인 조사지에 대한 데이터가 없습니다.')
        return;
      }

      versionDesc.value = rows[0].description || "";

      bindPrevVersionToSections(rows);

      alert("현재 사용중인 조사지의 버전 데이터를 불러왔습니다.");
    }else{
      alert(result.message || "이전버전 불러오기 실패");
    }
    
  }catch (err) {
    console.log(err);
  }
};

const openModal = () => {
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "auto";
};

const surveyInfo = async () => {
  const payload = makeSurveyPayload();

  if (!payload.version) {
    alert("버전을 입력하세요.");
    return;
  }

  if (!payload.description) {
    alert("버전 상세설명을 입력하세요.");
    return;
  }

  if (payload.items.length === 0) {
    alert("등록할 문항을 하나 이상 입력하세요.");
    return;
  }

  try {
    const result = await insertSurveyForm(payload);
    console.log(`백단 응답 : ${result}`);
    if (result.status === "Success") {
      alert("정상적으로 등록되었습니다.");
      closeModal();
      router.go(0);
    } else {
      console.log("실패 응답:", result);
      alert(result.message || "등록 실패");
    }
  } catch (err) {
    console.log(err);
    alert("서버 연결 안됨 (백단 없음)");
  }
};

//back단 보내기전 data 구조분해 및 점검
const makeSurveyPayload = () => {
  const items = [];

  allSections.value.forEach((section) => {
    section.subs.forEach((sub) => {
      sub.inputs.forEach((item, idx) => {
        const text = item.text?.trim();

        if (text) {
          items.push({
            titleCode: sub.titleCode,
            question_no: idx + 1,
            question_text: text,
            answer_type: item.answerType, // YN or TEXT
          });
        }
      });
    });
  });

  return {
    Sys_Id: "ADM0000", // 나중에 로그인한 관리자값으로 교체
    version: version.value.trim(),
    description: versionDesc.value.trim(),
    created_at: today,
    items,
  };
};

// back단 데이터 송신
const insertSurveyForm = async (payload) => {
  const result = await fetch("/api/admin/surveyadd", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await result.json();
  return data;
};

//조사지 최근버전가져오기
const getLatestVersion = async () => {
  const result = await fetch(`/api/admin/latestVersion`)
  .then((resp) => resp.json())
  .catch((err) => console.log(err));

  version.value = makeNextVersion(result.data[0].version);;
};

//version 계산기
const makeNextVersion = (ver) => {
  let [major, minor] = ver.split(".").map(Number);

  minor += 1;

  if (minor >= 10) {
    major += 1;
    minor = 0;
  }

  return `${major}.${minor}`;
};

onBeforeMount(()=>{
  getLatestVersion();
});
</script>

<style scoped>
.table td,
.table th {
  padding: 0.75rem 0.5rem;
}

.bg-gray-100 {
  background-color: #f8f9fa !important;
}

.question-input {
  flex: 1;
  min-width: 260px;
}

.answer-select {
  width: 160px;
  min-width: 160px;
}

.preview-box {
  padding: 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
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
