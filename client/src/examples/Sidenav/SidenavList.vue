<template>
  <div class="sidebar-layout-container">
    <ul class="navbar-nav w-100">
      <li class="nav-item ps-4 pt-4 pe-3">
        <h5 class="font-weight-bolder text-dark mb-4">지원자 정보 입력</h5>

        <div class="mb-3">
          <label class="form-label text-xs font-weight-bold text-secondary mb-1"
            >지원대상자명</label
          >
          <select
            class="form-select border custom-input"
            v-model="surveyStore.selectedUserId"
          >
            <option value="">지원 대상자를 선택하세요</option>
            <option
              v-for="user in uniqueUserList"
              :key="user.support_id"
              :value="user.support_id"
            >
              {{ user.name }}
            </option>
          </select>
        </div>

        <hr class="horizontal dark mt-4 mb-4" />

        <div class="mb-3">
          <label class="form-label text-xs font-weight-bold text-secondary mb-2"
            >장애유형</label
          >
          <input
            type="text"
            class="form-control border custom-input mb-2"
            :value="selectedUserInfo.majorName || ''"
            readonly
            placeholder="대분류"
          />
          <input
            type="text"
            class="form-control border custom-input mb-2"
            placeholder="중분류"
            :value="selectedUserInfo.middleName || ''"
            readonly
          />
          <input
            type="text"
            class="form-control border custom-input"
            placeholder="소분류"
            :value="selectedUserInfo.sub || ''"
            readonly
          />
        </div>

        <hr class="horizontal dark mt-4 mb-4" />

        <div class="row g-2 mb-3">
          <div class="col-5">
            <label
              class="form-label text-xs font-weight-bold text-secondary mb-1"
              >성별</label
            >
            <input
              type="text"
              class="form-control border custom-input text-center"
              :value="selectedUserInfo.genderLabel || ''"
              placeholder="남/여"
              readonly
            />
          </div>
          <div class="col-7">
            <label
              class="form-label text-xs font-weight-bold text-secondary mb-1"
              >생년월일</label
            >
            <input
              type="text"
              class="form-control border custom-input text-center"
              :value="selectedUserInfo.born || ''"
              placeholder="YY.MM.DD"
              readonly
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useSurveyStore } from "@/store/survey";
const surveyStore = useSurveyStore();

const genders = ref([]);
const selectedGender = ref("");
const disabilityTypes = ref([]);
const consultMiddle = ref([]);

//남여 공통코드
const fetchGenders = async () => {
  try {
    const response = await fetch("/api/survey/gender");
    const data = await response.json();
    genders.value = data;

    if (data.length > 0) {
      selectedGender.value = data[0].codeName;
    }
  } catch (err) {
    console.log(err);
  }
};

//지원대상자 가져오기
const fetchSupportList = async () => {
  try {
    const response = await fetch("/api/survey/support");
    const data = await response.json();
    surveyStore.userList = data;
  } catch (err) {
    console.error("지원자 목록 로드 실패:", err);
  }
};

// 중복 제거된 리스트 계산
const uniqueUserList = computed(() => {
  const seen = new Set();
  return (surveyStore.userList || []).filter((user) => {
    const id = user.support_id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
});

// 선택된 사용자 정보
const selectedUserInfo = computed(() => {
  const user = uniqueUserList.value.find(
    (u) => u.support_id === surveyStore.selectedUserId,
  );

  if (!user)
    return {
      middleName: "",
      sub: "",
      genderLabel: "",
      born: "",
      majorName: "",
    };

  // 생년월일
  const formattedBorn = user.born ? String(user.born).substring(0, 10) : "";

  //fetchGenders로 가져온 데이터에서 성별 이름 찾기
  const genderObj = genders.value.find((g) => g.Code === user.gender);
  const genderLabel = genderObj ? genderObj.codeName : user.gender;

  //장애유형 대분류
  const majorName = user.major
    ? user.major
        .split(",")
        .map((code) => {
          const found = disabilityTypes.value.find(
            (t) => t.code === code.trim(),
          );
          return found ? found.description : code;
        })
        .join(", ")
    : "";

  //장애유형 중뷴류
  const middleName = user.middle
    ? user.middle
        .split(",")
        .map((c) => {
          const targetCode = c.trim();
          const found = consultMiddle.value.find(
            (t) => t.j_Code === targetCode,
          );
          return found ? found.description : targetCode;
        })
        .join(", ")
    : "";

  return {
    ...user,
    born: formattedBorn,
    genderLabel: genderLabel,
    majorName: majorName,
    middleName: middleName,
  };
});

//장애유형(대분류)
const fetchDisabilityTypes = async () => {
  try {
    const response = await fetch("/api/survey/disability-types");
    if (!response.ok) throw new Error("네트워크 응답 에러");
    const data = await response.json();
    disabilityTypes.value = data;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
};

//장애유형(중분류)
const fetchConsultMiddle = async () => {
  try {
    const response = await fetch("/api/survey/consultMiddle");
    if (!response.ok) throw new Error("네트워크 응답 에러");
    const data = await response.json();
    consultMiddle.value = data;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
};

onMounted(() => {
  fetchGenders();
  fetchSupportList();
  fetchDisabilityTypes();
  fetchConsultMiddle();
});
</script>

<style scoped>
.survey-page {
  position: relative;
}

.sidebar-layout-container {
  display: flex;
}

.sidebar {
  position: fixed;
  width: 250px;
  height: 100vh;
  z-index: 100;
}

.main-content {
  margin-left: 250px;
}

.sidebar-layout-container {
  position: fixed;
  top: 85px;
  left: 0;
  width: 260px;
  height: calc(100vh - 85px);
  z-index: 2000;
  background-color: #fff;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
}

.main-content {
  margin-left: 260px;
  padding: 2rem;
}
.sidebar-layout-container {
  position: fixed !important;
  top: 85px !important;
  left: 0 !important;
  width: 260px !important;
  height: calc(100vh - 85px) !important;
  z-index: 2000 !important;
  background-color: #ffffff !important;
  border-right: 1px solid #e9ecef !important;
  overflow-y: auto !important;

  -ms-overflow-style: none;
  scrollbar-width: none;
}

.sidebar-layout-container::-webkit-scrollbar {
  display: none;
}

.custom-input {
  display: block !important;
  width: 100% !important;
  background-color: #f8f9fa !important;
  border: 1px solid #d2d6da !important;
  border-radius: 8px !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 0.875rem !important;
  color: #495057 !important;
}

.custom-input:focus {
  background-color: #ffffff !important;
  border-color: #5e72e4 !important;
  box-shadow: 0 0 0 2px rgba(94, 114, 228, 0.2) !important;
  outline: none !important;
}

.horizontal.dark {
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0)
  );
  height: 1px;
  border: 0;
  opacity: 0.5;
}

.form-label {
  margin-bottom: 0.25rem;
}

.text-xs {
  font-size: 0.75rem !important;
}

:deep(.content-area) {
  margin-left: 260px !important;
  padding: 2rem !important;
}
</style>
