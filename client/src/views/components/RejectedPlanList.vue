<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
// 💡 1. 우리가 새로 만든 반려 전용 카드를 불러오도록 수정!
import RejectedPlanCardList from "@/views/components/RejectedPlanCardList.vue";
import { Modal } from "bootstrap";

const route = useRoute();
// 기관 관리자인지 담당자인지 Role 설정 (라우터 경로 기준)
const currentUserRole = ref(
  route.path.includes("/general") ? "GENERAL" : "MANAGER",
);

const planList = ref([]);
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
});
let searchModalInstance = null;

// 반려 내역 전용 API 호출
const fetchRejectedPlans = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/rejected/plan/list",
      {
        params: {
          role: currentUserRole.value,
          page: 1,
          limit: 10,
          ...searchFilters.value,
        },
      },
    );
    planList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("반려내역 로딩 실패:", error);
  }
};

const showSearchModal = () => {
  if (searchModalInstance) searchModalInstance.show();
};
const applySearch = () => {
  fetchRejectedPlans();
  if (searchModalInstance) searchModalInstance.hide();
};
const resetSearch = () => {
  searchFilters.value = { managerName: "", guardianName: "", supportName: "" };
  fetchRejectedPlans();
  if (searchModalInstance) searchModalInstance.hide();
};

onMounted(() => {
  fetchRejectedPlans();
  const modalElement = document.getElementById("searchModal");
  if (modalElement) searchModalInstance = new Modal(modalElement);
});
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">지원계획서 반려 내역 조회</h5>
          <button
            class="btn btn-outline-primary btn-sm mb-0"
            @click="showSearchModal"
          >
            <i class="fas fa-search me-2"></i>상세 검색
          </button>
        </div>

        <RejectedPlanCardList :planList="planList" />
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
              placeholder="예: 이설화"
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
              placeholder="예: 이미지"
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
              placeholder="예: 홍길동"
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
