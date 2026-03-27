<!-- <김민지, 전체 코드 간략하게 수정중 26.03.25>  -->
<script setup>
import { computed, ref, defineEmits } from "vue"; //계산된 값과 변수를 반응형으로 만듦
import { onMounted } from "vue"; //지원대상자 이름 가지고오는 함수 시도중
import axios from "axios";
import { useRoute } from "vue-router"; //현재 URL 정보를 가져옴
const route = useRoute();
// [추가] 부모 컴포넌트(survey.vue)로 데이터를 보내기 위한 emit 정의
const emit = defineEmits(["select-support"]);

// 현재 경로가 설문 추가 페이지인지 확인 (라우트 이름 또는 경로 포함 여부 체크)
const isSurveyPage = computed(() => {
  return route.name === "userSurveyAdd" || route.path.includes("userSurveyAdd");
});
//route.name === "userSurveyAdd" 라우트 이름
//route.path.includes("userSurveyAdd") = URL에 해당 문자열 포함되어 있는지 확인
//includes : 문자열 안에 특정 글자가 포함되어 있는지 확인하는 함수
// || : 둘 중 하나라도 맞으면 true
//이 함수 없으면 템플릿에서 사용한 변수가 사라지는거라 렌더딩안됨

// 인풋 데이터 정의
const applicantName = ref("");
const largeCategory = ref("");
const mediumCategory = ref("");
const smallCategory = ref("");
const gender = ref("");
const birthDate = ref("");

//지원대상자명 선택하는 함수 시도중
const users = ref([]);

//   //페이지 로딩 시 자동 실행
const guserId = ref(""); //지원대상자 이름 실제값 반응형
// const resp = await axios.get(
//   `http://localhost:3000/main/support/supList/${guserId}`,
// );
// //   //axios : 프론트 + 백엔드 연결해주는 durgkf
// users.value = resp.data;
// console.log("대상자 목록 로드 완료:", users.value);
// });

// --- [추가] 이름 선택 시 실행되는 함수 (중요!) ---
const onUserChange = () => {
  // 1. 선택된 이름과 일치하는 데이터를 리스트에서 찾음
  const selectedUser = users.value.find(
    (user) => user.name === applicantName.value,
  );

  if (selectedUser) {
    // 2. 사이드바 내부 입력창들에 데이터 자동 채우기
    largeCategory.value = selectedUser.major;
    mediumCategory.value = selectedUser.middle;
    smallCategory.value = selectedUser.sub;
    gender.value = selectedUser.gender;
    birthDate.value = selectedUser.born;

    // 3. 부모(survey.vue)에게 선택된 support_id를 전달 (DB 저장을 위함)
    emit("select-support", selectedUser.support_id);
  } else {
    // 선택 해제 시 초기화
    clearFields();
  }
};

const clearFields = () => {
  largeCategory.value = "";
  mediumCategory.value = "";
  smallCategory.value = "";
  gender.value = "";
  birthDate.value = "";
};

onMounted(async () => {
  // .value를 붙여야 하지만, 만약 '전체 목록'을 가져오는 API라면
  // 뒤에 ID를 붙이지 않고 호출해야 할 수도 있습니다.
  // 일단 현재 코드에서 에러를 고치려면 .value를 붙입니다.
  try {
    const resp = await axios.get(
      `http://localhost:3000/support/${guserId.value}`,
    );
    users.value = resp.data;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
});
</script>

<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100 sidebar-layout-container"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <template v-if="isSurveyPage">
        <li class="nav-item ps-4 pt-4">
          <h5 class="font-weight-bolder text-dark mb-4">지원자 정보 입력</h5>

          <div class="mb-3 me-3">
            <select
              v-model="applicantName"
              @change="onUserChange"
              class="form-select border custom-input"
            >
              <option value="">선택하세요</option>
              <option
                v-for="user in users"
                :key="user.support_id"
                :value="user.name"
              >
                {{ user.name }}
              </option>
            </select>
          </div>

          <hr class="horizontal dark mt-4 mb-4 me-3" />

          <div class="mb-3 me-3">
            <label
              class="form-label text-sm font-weight-bold text-secondary mb-2"
              >장애유형</label
            >
            <input
              type="text"
              v-model="largeCategory"
              class="form-control border custom-input mb-2"
              placeholder="대분류 입력"
              readonly
            />
            <input
              type="text"
              v-model="mediumCategory"
              class="form-control border custom-input mb-2"
              placeholder="중분류 입력"
              readonly
            />
            <input
              type="text"
              v-model="smallCategory"
              class="form-control border custom-input"
              placeholder="소분류 입력"
              readonly
            />
          </div>

          <hr class="horizontal dark mt-4 mb-4 me-3" />

          <div class="d-flex mb-3 me-3">
            <div class="w-45 me-3">
              <label class="form-label text-sm font-weight-bold text-secondary"
                >성별</label
              >
              <input
                type="text"
                v-model="gender"
                class="form-control border custom-input text-center"
                placeholder="남/여"
                readonly
              />
            </div>
            <div class="flex-fill">
              <label class="form-label text-sm font-weight-bold text-secondary"
                >생년월일</label
              >
              <input
                type="text"
                v-member="birthDate"
                v-model="birthDate"
                class="form-control border custom-input text-center"
                placeholder="YY.MM.DD"
                readonly
              />
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
/* 1. 사이드바 위치 강제 조정 (상단바 아래로) */
.sidebar-layout-container,
.sidebar-main-wrapper {
  position: fixed !important;
  top: 100px !important;
  left: 0 !important;
  width: 250px !important;
  height: calc(100vh - 85px) !important;
  z-index: 1000 !important;
  background-color: #ffffff !important;
  border-right: 1px solid #e9ecef !important;

  /* 핵심: 스크롤 기능은 유지하되 바만 숨김 */
  overflow-y: auto !important; /* 내용이 넘칠 때만 스크롤 작동 */
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
}
/* Chrome, Safari, Opera에서 스크롤바를 숨김 */
.sidebar-layout-container::-webkit-scrollbar,
.sidebar-main-wrapper::-webkit-scrollbar {
  display: none;
}
/* 2. 메인 콘텐츠 영역 중앙 정렬 강제 (사이드바 침범 방지) */
/* 부모의 content-area를 사이드바 너비만큼 왼쪽 마진을 주어 중앙으로 밀어넣습니다. */
:deep(.content-area),
:global(.content-area) {
  margin-left: 250px !important;
  display: flex !important;
  justify-content: center !important;
  padding: 2rem !important;
}

/* 3. 조사지 카드 너비 제한 (너무 퍼지지 않게 중앙 집중) */
:deep(.row),
:global(.row) {
  justify-content: center !important;
  width: 100% !important;
  max-width: 1200px !important;
  margin: 0 auto !important;
}

/* --- 기존 스타일 및 주석 유지 --- */
.custom-input {
  display: block !important;
  width: 100% !important;
  background-color: #ffffff !important;
  border: 1px solid #d2d6da !important;
  border-radius: 8px !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 0.875rem !important;
}

.custom-input:focus {
  border-color: #5e72e4 !important;
  box-shadow: 0 0 0 2px rgba(94, 114, 228, 0.2) !important;
  outline: none !important;
}

.text-center {
  text-align: center !important;
}

.w-45 {
  width: 45% !important;
}

.horizontal.dark {
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0)
  );
  height: 1px;
  border: 0;
  margin: 1rem 0;
}

/* 스크롤바 설정 .navbar-collapse {
  overflow-y: auto !important;
} */

/* 템플릿 기본 aside 태그 강제 하단 이동 */
:deep(aside),
:deep(.sidenav) {
  top: 85px !important;
}
</style>
