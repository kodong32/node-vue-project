<!-- D:\node-vue-project\client\src\views\components\GeneralResultList.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GeneralResultCardList from "@/views/components/GeneralResultCardList.vue";
import { Modal } from "bootstrap";
import RoleHeader from "./RoleHeader.vue";

const route = useRoute();

const resultList = ref([]);
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
});
let searchModalInstance = null;

// 🌟 1. 세션에서 꺼낼 진짜 이름과 역할 바구니
const currentUserName = ref("");
const actualUserRole = ref(""); // "USER", "MANAGER", "GENERAL" 중 하나가 됨

// 🌟 2. 세션 확인 (진짜 신분 확인)
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentUserName.value = response.data.user.name;

      if (response.data.userType === "USER") {
        actualUserRole.value = "USER"; // 일반 이용자
      } else {
        // 기관 사용자일 경우 role에 따라 담당자/관리자 구분
        const role = response.data.user.role || response.data.user.roll;
        actualUserRole.value = role === "a003" ? "MANAGER" : "GENERAL";
      }
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

// 💡 3. 타이틀도 세션 권한에 따라 동적으로!
const pageTitle = computed(() => {
  if (actualUserRole.value === "USER") return "내 지원결과서 내역";
  if (actualUserRole.value === "MANAGER") return "내 지원결과서 조회";
  return "기관 전체 지원결과서 조회";
});

// 💡 4. 목록 불러오기 API 호출 (API 주소 갈라치기!)
const fetchResults = async () => {
  try {
    // 🌟 권한에 따라 찌를 API 주소 결정!
    const apiUrl =
      actualUserRole.value === "USER"
        ? "/api/user/result/list" // 🚨 일반 이용자용 백엔드 라우터 (하단 설명 참고!)
        : "/api/result/plan/general-list"; // 기관 이용자용 백엔드 라우터

    const response = await axios.get(apiUrl, {
      params: {
        page: 1,
        limit: 10,
        // 🚨 role: userRole.value 👈 백엔드가 알아서 하니까 지워버림!
        surveyId: route.query.surveyId,
        ...searchFilters.value,
      },
    });
    resultList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("결과서 목록 로딩 실패:", error);
  }
};

// 검색 로직
const showSearchModal = () => {
  if (searchModalInstance) searchModalInstance.show();
};
const applySearch = () => {
  fetchResults();
  if (searchModalInstance) searchModalInstance.hide();
};
const resetSearch = () => {
  searchFilters.value = { managerName: "", guardianName: "", supportName: "" };
  fetchResults();
  if (searchModalInstance) searchModalInstance.hide();
};

onMounted(async () => {
  // 🌟 5. 무조건 세션부터 확인하고 -> 데이터 불러오기
  await checkSession();
  fetchResults();

  const searchEl = document.getElementById("searchModal");
  if (searchEl) searchModalInstance = new Modal(searchEl);
});
</script>

<template>
  <div class="container-fluid py-4">
    <RoleHeader />
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">{{ pageTitle }}</h5>
          <button
            class="btn btn-outline-primary btn-sm mb-0"
            @click="showSearchModal"
          >
            <i class="fas fa-search me-2"></i>상세 검색
          </button>
        </div>

        <GeneralResultCardList :resultList="resultList" />
      </div>
    </div>
  </div>

  <div class="modal fade" id="searchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">상세 검색</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >담당자 이름</label
            ><input
              type="text"
              class="form-control"
              v-model="searchFilters.managerName"
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >보호자 이름</label
            ><input
              type="text"
              class="form-control"
              v-model="searchFilters.guardianName"
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >지원대상자 이름</label
            ><input
              type="text"
              class="form-control"
              v-model="searchFilters.supportName"
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
