<!-- D:\node-vue-project\client\src\views\components\ApprovalPlanList.vue -->
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ApprovalPlanCardList from "@/views/components/ApprovalPlanCardList.vue";
import { Modal } from "bootstrap";
import RoleHeader from "./RoleHeader.vue";

const router = useRouter();

const planList = ref([]);
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
});

// 🌟 헤더에 띄울 진짜 내 이름 바구니
const currentUserName = ref("");

// 모달 인스턴스와 데이터
let searchModalInstance = null;
let rejectModalInstance = null;

const targetPlanId = ref("");
const rejectReasonText = ref("");

// 🌟 0. 세션에서 내 이름 꺼내기
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentUserName.value = response.data.user.name;
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

// 💡 1. 대기 목록 불러오기 (프록시 /api 적용 완료!)
const fetchPendingPlans = async () => {
  try {
    const response = await axios.get("/api/approval/plan/list", {
      params: { page: 1, limit: 10, ...searchFilters.value },
    });
    planList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("대기 목록 로딩 실패:", error);
  }
};

// 💡 2. 승인 처리 로직 (프록시 /api 적용 완료!)
const handleApprove = async (planId) => {
  if (!confirm("이 지원계획서를 승인하시겠습니까?")) return;

  try {
    // 🌟 백엔드가 세션에서 내 아이디를 알아서 꺼내므로, 여기선 글 ID(planId)만 보내면 끝!
    await axios.put(`/api/approval/plan/approve/${planId}`);

    alert("승인이 완료되었습니다.");
    router.push("/general/plan");
  } catch (error) {
    alert("승인 처리 중 오류가 발생했습니다.");
    console.error(error);
  }
};

// 3. 반려 모달 띄우기
const openRejectModal = (planId) => {
  targetPlanId.value = planId;
  rejectReasonText.value = "";
  if (rejectModalInstance) rejectModalInstance.show();
};

// 💡 4. 반려 처리 로직 (프록시 /api 적용 완료!)
const submitReject = async () => {
  if (!rejectReasonText.value.trim()) {
    alert("반려 사유를 입력해주세요.");
    return;
  }

  try {
    // 🌟 여기도 프록시 적용!
    await axios.put(`/api/approval/plan/reject/${targetPlanId.value}`, {
      rejectReason: rejectReasonText.value,
    });
    alert("반려 처리가 완료되었습니다.");
    if (rejectModalInstance) rejectModalInstance.hide();
    router.push("/general/plan");
  } catch (error) {
    alert("반려 처리 중 오류가 발생했습니다.");
    console.error(error);
  }
};

// 검색 관련 로직
const showSearchModal = () => {
  if (searchModalInstance) searchModalInstance.show();
};
const applySearch = () => {
  fetchPendingPlans();
  if (searchModalInstance) searchModalInstance.hide();
};
const resetSearch = () => {
  searchFilters.value = { managerName: "", guardianName: "", supportName: "" };
  fetchPendingPlans();
  if (searchModalInstance) searchModalInstance.hide();
};

onMounted(async () => {
  // 🌟 세션부터 확인해서 이름 세팅 후, 리스트 불러오기!
  await checkSession();
  fetchPendingPlans();

  const searchEl = document.getElementById("searchModal");
  if (searchEl) searchModalInstance = new Modal(searchEl);
  const rejectEl = document.getElementById("rejectModal");
  if (rejectEl) rejectModalInstance = new Modal(rejectEl);
});
</script>

<template>
  <div class="container-fluid py-4">
    <RoleHeader />
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">지원계획서 승인 / 반려</h5>
          <button
            class="btn btn-outline-primary btn-sm mb-0"
            @click="showSearchModal"
          >
            <i class="fas fa-search me-2"></i>상세 검색
          </button>
        </div>

        <ApprovalPlanCardList
          :planList="planList"
          @onApprove="handleApprove"
          @onRejectClick="openRejectModal"
        />
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
            aria-label="Close"
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

  <div class="modal fade" id="rejectModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger">지원계획서 반려</h5>
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
              >반려 사유 작성</label
            >
            <textarea
              class="form-control"
              rows="5"
              placeholder="반려 사유를 상세히 적어주세요."
              v-model="rejectReasonText"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary mb-0"
            data-bs-dismiss="modal"
          >
            취소
          </button>
          <button
            type="button"
            class="btn btn-danger mb-0"
            @click="submitReject"
          >
            반려 등록
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
