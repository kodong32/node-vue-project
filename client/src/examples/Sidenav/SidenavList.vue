<!-- <김민지, 전체 코드 간략하게 수정중 26.03.30>  -->
<script setup>
import { ref, defineEmits, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const emit = defineEmits(["select-support"]);

const selectedSupportId = ref("");
const users = ref([]);
const guserId = ref("GUSR0000");

const largeCategory = ref("");
const mediumCategory = ref("");
const smallCategory = ref("");
const gender = ref("");
const birthDate = ref("");

const isSurveyPage = computed(() => {
  return route.name === "userSurveyAdd" || route.path.includes("userSurveyAdd");
});

const onUserChange = () => {
  const selectedUser = users.value.find(
    (u) => u.support_id === selectedSupportId.value,
  );

  if (!selectedUser) return;

  const genderMap = {
    c001: "남",
    c002: "여",
  };
  const categoryMap = {
    MJ001: "기질성 정신장애",
    MJ002: "정신 및 행동장애",
    MJ003: "조현병 및 망상장애",
    MJ004: "기분 장애",
    MJ005: "신경증성 및 신체형 장애",
    MJ006: "생리 장애 및 행동증후군",
    MJ007: "성인 인격 및 행동의 장애",
    MJ008: "정신지체",
    MJ009: "정신발달장애",
    MJ010: "소아기 및 청소년기 행동 및 정서 장애",
    MJ011: "상세불명의 정신장애",
  };

  largeCategory.value = selectedUser.major
    ?.split(",")
    .map((code) => categoryMap[code] || code)
    .join(", ");
  mediumCategory.value = selectedUser.middle_category || "정보 없음";
  smallCategory.value = selectedUser.sub;
  gender.value = genderMap[selectedUser.gender] || selectedUser.gender;
  birthDate.value = selectedUser.born?.split("T")[0];

  emit("select-support", selectedSupportId.value);
};

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/survey/support/${guserId.value}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }
    const data = await response.json();

    users.value = data || [];
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
              v-model="selectedSupportId"
              @change="onUserChange"
              class="form-select border custom-input"
            >
              <option value="">지원 대상자를 선택하세요</option>
              <option
                v-for="user in users"
                :key="user.support_id"
                :value="user.support_id"
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
  overflow: hidden !important;
  top: 100px !important;
  left: 0 !important;
  width: 250px !important;
  height: auto !important;
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
