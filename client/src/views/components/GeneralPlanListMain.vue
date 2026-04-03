<!-- D:\node-vue-project\client\src\views\components\GeneralPlanListMain.vue -->
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GeneralPlanCardList from "@/views/components/GeneralPlanCardList.vue";
import { Modal } from "bootstrap";
import RoleHeader from "./RoleHeader.vue";

const route = useRoute();
const currentSurveyId = route.params.surveyId || route.query.surveyId || "";

// 🌟 1. 진짜 정보 바구니 준비 (하드코딩 제거!)
const userRole = ref("");
const currentUserName = ref("");
const planList = ref([]);

// 검색 필터 상태 변수
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
  surveyId: currentSurveyId,
});

let searchModalInstance = null;

// 🌟 2. 세션 확인 함수 추가 (진짜 신분 확인)
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentUserName.value = response.data.user.name;

      // 세션에서 주는 userType("USER" 또는 "INST")에 따라 역할 세팅
      if (response.data.userType === "USER") {
        userRole.value = "USER";
      } else {
        userRole.value = "GENERAL"; // 기관 관리자
      }
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

// 💡 3. 데이터 불러오기 함수 (프록시 적용 및 하드코딩 파라미터 삭제)
const fetchPlans = async () => {
  try {
    // 프록시 적용된 API 주소
    const apiUrl =
      userRole.value === "USER"
        ? "/api/user/plan/list" // 유저용 API (추후 구현될 부분)
        : "/api/general/plan/list"; // 관리자용 API (방금 수술 완료한 곳!)

    const response = await axios.get(apiUrl, {
      params: {
        // 🚨 instiId: instiId.value 👈 백엔드가 세션에서 알아서 꺼내므로 삭제!
        page: 1,
        limit: 10,
        managerName: searchFilters.value.managerName,
        guardianName: searchFilters.value.guardianName,
        supportName: searchFilters.value.supportName,
        surveyId: searchFilters.value.surveyId,
      },
    });
    planList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("계획서 목록 로딩 실패:", error);
  }
};

const showSearchModal = () => {
  if (searchModalInstance) searchModalInstance.show();
};

const applySearch = () => {
  fetchPlans();
  if (searchModalInstance) searchModalInstance.hide();
};

const resetSearch = () => {
  searchFilters.value = {
    managerName: "",
    guardianName: "",
    supportName: "",
    surveyId: currentSurveyId,
  };
  fetchPlans();
  if (searchModalInstance) searchModalInstance.hide();
};

onMounted(async () => {
  // 🌟 4. 무조건 세션부터 확인하고 -> 리스트를 불러오는 순서 맞추기!
  await checkSession();
  fetchPlans();

  const modalElement = document.getElementById("searchModal");
  if (modalElement) {
    searchModalInstance = new Modal(modalElement);
  }
});
</script>

<template>
  <div class="container-fluid py-4">
    <RoleHeader />
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">지원계획서 목록</h5>

          <button
            class="btn btn-outline-primary btn-sm mb-0"
            @click="showSearchModal"
          >
            <i class="fas fa-search me-2"></i>상세 검색
          </button>
        </div>

        <GeneralPlanCardList :planList="planList" :userRole="userRole" />
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="searchModal"
    tabindex="-1"
    aria-labelledby="searchModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="searchModalLabel">상세 검색</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >담당자 이름</label
            >
            <input
              type="text"
              class="form-control"
              v-model="searchFilters.managerName"
              placeholder="담당자 이름 입력 (예: 이설화)"
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >보호자 이름</label
            >
            <input
              type="text"
              class="form-control"
              v-model="searchFilters.guardianName"
              placeholder="보호자 이름 입력 (예: 이미지)"
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >지원대상자 이름</label
            >
            <input
              type="text"
              class="form-control"
              v-model="searchFilters.supportName"
              placeholder="지원자 이름 입력 (예: 홍길동)"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary mb-0"
            @click="resetSearch"
          >
            초기화
          </button>
          <button
            type="button"
            class="btn btn-primary mb-0"
            @click="applySearch"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
