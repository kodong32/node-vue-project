<!-- D:\node-vue-project\client\src\views\components\ApprovalResultList.vue -->
<script setup>
import { ref, onMounted } from "vue";
// import { useRouter } from "vue-router";
import axios from "axios";
import ApprovalResultCardList from "@/views/components/ApprovalResultCardList.vue";
import { Modal } from "bootstrap";

// const router = useRouter();

const resultList = ref([]);
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
});

let searchModalInstance = null;
let rejectModalInstance = null;

const targetResultId = ref("");
const rejectReasonText = ref("");

// 1. 대기 목록 불러오기 (결과서 API)
const fetchPendingResults = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/approval/result/list",
      {
        params: { page: 1, limit: 10, ...searchFilters.value },
      },
    );
    resultList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("결과서 대기 목록 로딩 실패:", error);
  }
};

// 2. 승인 처리 로직
const handleApprove = async (resultId) => {
  if (!confirm("이 지원결과서를 승인하시겠습니까?")) return;

  try {
    await axios.put(
      `http://localhost:3000/approval/result/approve/${resultId}`,
    );
    alert("승인이 완료되었습니다.");
    fetchPendingResults(); // 승인 후 목록 새로고침 (혹은 다른 페이지로 이동)
  } catch (error) {
    alert("승인 처리 중 오류가 발생했습니다.");
    console.error(error);
  }
};

// 3. 반려 모달 띄우기
const openRejectModal = (resultId) => {
  targetResultId.value = resultId;
  rejectReasonText.value = "";
  if (rejectModalInstance) rejectModalInstance.show();
};

// 4. 반려 처리 로직
const submitReject = async () => {
  if (!rejectReasonText.value.trim()) {
    alert("반려 사유를 입력해주세요.");
    return;
  }

  try {
    await axios.put(
      `http://localhost:3000/approval/result/reject/${targetResultId.value}`,
      {
        rejectReason: rejectReasonText.value,
      },
    );
    alert("반려 처리가 완료되었습니다.");
    if (rejectModalInstance) rejectModalInstance.hide();
    fetchPendingResults(); // 반려 후 목록 새로고침
  } catch (error) {
    alert("반려 처리 중 오류가 발생했습니다.");
    console.error(error);
  }
};

// 검색 로직
const showSearchModal = () => {
  if (searchModalInstance) searchModalInstance.show();
};
const applySearch = () => {
  fetchPendingResults();
  if (searchModalInstance) searchModalInstance.hide();
};
const resetSearch = () => {
  searchFilters.value = { managerName: "", guardianName: "", supportName: "" };
  fetchPendingResults();
  if (searchModalInstance) searchModalInstance.hide();
};

onMounted(() => {
  fetchPendingResults();
  const searchEl = document.getElementById("searchModal");
  if (searchEl) searchModalInstance = new Modal(searchEl);
  const rejectEl = document.getElementById("rejectModal");
  if (rejectEl) rejectModalInstance = new Modal(rejectEl);
});
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">지원결과서 승인 / 반려</h5>
          <button
            class="btn btn-outline-primary btn-sm mb-0"
            @click="showSearchModal"
          >
            <i class="fas fa-search me-2"></i>상세 검색
          </button>
        </div>

        <ApprovalResultCardList
          :resultList="resultList"
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
          <h5 class="modal-title text-danger">지원결과서 반려</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
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
