<!-- D:\node-vue-project\client\src\views\components\GeneralResultList.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GeneralResultCardList from "@/views/components/GeneralResultCardList.vue";
import { Modal } from "bootstrap";

const route = useRoute();

const resultList = ref([]);
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
});
let searchModalInstance = null;

// 🌟 현재 접속한 라우터 경로를 보고 권한(role)을 파악!
// 경로에 '/manager/'가 있으면 담당자, 아니면 관리자('general')로 간주
const userRole = computed(() => {
  return route.path.includes("/manager/") ? "manager" : "general";
});

// 타이틀도 권한에 따라 동적으로 변경!
const pageTitle = computed(() => {
  return userRole.value === "manager"
    ? "내 지원결과서 조회"
    : "기관 전체 지원결과서 조회";
});

// 1. 목록 불러오기 API 호출 (role 파라미터 포함)
const fetchResults = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/result/plan/general-list",
      {
        params: {
          page: 1,
          limit: 10,
          role: userRole.value, // 💡 백엔드에 권한 정보 전달!
          surveyId: route.query.surveyId,
          ...searchFilters.value,
        },
      },
    );
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

onMounted(() => {
  fetchResults();
  const searchEl = document.getElementById("searchModal");
  if (searchEl) searchModalInstance = new Modal(searchEl);
});
</script>

<template>
  <div class="container-fluid py-4">
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
