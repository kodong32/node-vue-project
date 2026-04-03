<!-- D:\node-vue-project\client\src\views\components\ResultPlanWrite.vue -->
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Modal } from "bootstrap";
import RoleHeader from "./RoleHeader.vue";

const router = useRouter();

// 🌟 헤더에 띄울 진짜 이름 바구니
const currentUserName = ref("");

// 1. 상태 변수 모음
const planList = ref([]);
const selectedPlan = ref(null);
let planModalInstance = null;

// 검색 필터 상태
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
});

// 결과서 작성 폼 상태
const resultTitle = ref("");
const resultContent = ref("");
const file1 = ref(null);
const file2 = ref(null);

// 🌟 세션 확인 (이름 가져오기)
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentUserName.value = response.data.user.name;
    } else {
      alert("로그인이 필요합니다.");
      router.push("/"); // 비로그인 시 메인으로 쫓아내기 (선택 사항)
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

const handleFile1 = (event) => {
  file1.value = event.target.files[0];
};
const handleFile2 = (event) => {
  file2.value = event.target.files[0];
};

// 💡 2. 모달창 데이터 불러오기 (프록시 /api 적용 완료!)
const fetchApprovedPlans = async () => {
  try {
    const response = await axios.get("/api/result/plan/approved-list", {
      params: { page: 1, limit: 10, ...searchFilters.value },
    });
    planList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("계획서 목록 로딩 실패:", error);
  }
};

// 3. 모달 제어 함수
const openPlanModal = () => {
  fetchApprovedPlans();
  if (planModalInstance) planModalInstance.show();
};
const applySearch = () => {
  fetchApprovedPlans();
};
const resetSearch = () => {
  searchFilters.value = { managerName: "", guardianName: "", supportName: "" };
  fetchApprovedPlans();
};

// 4. 계획서 '선택' 버튼 눌렀을 때
const selectPlan = (plan) => {
  selectedPlan.value = plan;
  if (planModalInstance) planModalInstance.hide();
};

// 💡 5. 결과서 최종 등록 (프록시 /api 적용 완료!)
const submitResult = async () => {
  if (!selectedPlan.value) {
    alert("먼저 작성할 지원계획서를 선택해주세요.");
    return;
  }
  if (!resultTitle.value.trim() || !resultContent.value.trim()) {
    alert("지원결과 제목과 내용을 모두 입력해주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("supportPlan_id", selectedPlan.value.supportPlan_id);
  formData.append("result", resultTitle.value);
  formData.append("content", resultContent.value);

  if (file1.value) formData.append("file1", file1.value);
  if (file2.value) formData.append("file2", file2.value);

  try {
    // 🌟 여기도 프록시 /api 적용! (백엔드가 세션에서 작성자 ID를 알아서 꺼냄)
    await axios.post("/api/result/plan/write", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("지원결과서가 성공적으로 등록(승인 요청)되었습니다.");
    router.push("/manager/result/list");
  } catch (err) {
    alert("결과서 등록 중 오류가 발생했습니다.");
    console.error(err);
  }
};

onMounted(async () => {
  // 🌟 컴포넌트 마운트 시 세션부터 확인해서 이름 세팅!
  await checkSession();

  const modalEl = document.getElementById("planSelectModal");
  if (modalEl) planModalInstance = new Modal(modalEl);
});
</script>

<template>
  <div class="container-fluid py-4">
    <RoleHeader />
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="mb-0">지원결과서 작성</h5>
          <button class="btn btn-warning mb-0" @click="openPlanModal">
            <i class="fas fa-list me-2"></i>지원 계획서 목록 보기
          </button>
        </div>

        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body p-4">
            <div
              v-if="!selectedPlan"
              class="text-center py-5 bg-gray-100 border-radius-lg"
            >
              <i class="fas fa-file-signature fa-3x text-secondary mb-3"></i>
              <h6 class="text-secondary mb-0">
                우측 상단의 버튼을 눌러 작성할 지원계획서를 선택해주세요.
              </h6>
            </div>

            <div v-else>
              <div class="d-flex gap-4 mb-3 pb-3 border-bottom flex-wrap">
                <div>
                  <span class="text-secondary text-xs">작성일</span
                  ><span class="text-dark font-weight-bold ms-2">{{
                    selectedPlan.wirte_at
                  }}</span>
                </div>
                <div>
                  <span class="text-secondary text-xs">담당자</span
                  ><span class="text-dark font-weight-bold ms-2">{{
                    selectedPlan.managerName
                  }}</span>
                </div>
                <div>
                  <span class="text-secondary text-xs">보호자</span
                  ><span class="text-dark font-weight-bold ms-2">{{
                    selectedPlan.guardianName
                  }}</span>
                </div>
                <div>
                  <span class="text-secondary text-xs">지원대상자</span
                  ><span class="text-dark font-weight-bold ms-2">{{
                    selectedPlan.supportName
                  }}</span>
                </div>
                <div>
                  <span class="text-secondary text-xs">장애유형</span
                  ><span class="text-dark text-sm ms-2">{{
                    selectedPlan.disabilityType || "미지정"
                  }}</span>
                </div>
              </div>

              <div class="mb-3">
                <span class="text-secondary text-xs">지원계획 목표</span>
                <p
                  class="text-sm text-dark mb-0 mt-1 p-2 bg-gray-100 border-radius-md"
                >
                  {{ selectedPlan.purpose }}
                </p>
              </div>
              <div class="mb-4">
                <span class="text-secondary text-xs">지원계획 내용</span>
                <p
                  class="text-sm text-dark mb-0 mt-1 p-2 bg-gray-100 border-radius-md"
                  style="min-height: 60px"
                >
                  {{ selectedPlan.content }}
                </p>
              </div>

              <h6 class="text-dark mb-3 pt-3 border-top">
                <i class="fas fa-pen me-2"></i>결과서 작성란
              </h6>

              <div class="mb-3">
                <label class="form-label text-sm font-weight-bold"
                  >지원결과 제목</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="resultTitle"
                  placeholder="지원결과 제목을 적어주세요."
                />
              </div>
              <div class="mb-4">
                <label class="form-label text-sm font-weight-bold"
                  >지원결과 내용</label
                >
                <textarea
                  class="form-control"
                  rows="6"
                  v-model="resultContent"
                  placeholder="목표에 맞는 구체적인 지원 결과를 적어주세요."
                ></textarea>
              </div>

              <div class="row mb-4">
                <div class="col-md-6">
                  <label class="form-label text-sm font-weight-bold"
                    ><i class="fas fa-file-upload me-1"></i>첨부파일 1</label
                  >
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    @change="handleFile1"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-sm font-weight-bold"
                    ><i class="fas fa-file-upload me-1"></i>첨부파일 2</label
                  >
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    @change="handleFile2"
                  />
                </div>
              </div>

              <div class="d-flex justify-content-end">
                <button class="btn btn-primary px-5" @click="submitResult">
                  승인 요청
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="planSelectModal" tabindex="-1" aria-hidden="true">
    <div
      class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title">지원계획서 선택</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body pb-0">
          <div class="row g-2 mb-3">
            <div class="col-md-3">
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchFilters.managerName"
                placeholder="담당자 이름"
              />
            </div>
            <div class="col-md-3">
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchFilters.guardianName"
                placeholder="보호자 이름"
              />
            </div>
            <div class="col-md-4">
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="searchFilters.supportName"
                placeholder="지원대상자 이름"
              />
            </div>
            <div class="col-md-2 d-flex gap-1">
              <button
                class="btn btn-sm btn-secondary w-50 mb-0 px-0"
                @click="resetSearch"
              >
                <i class="fas fa-undo"></i>
              </button>
              <button
                class="btn btn-sm btn-primary w-50 mb-0 px-0"
                @click="applySearch"
              >
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <hr class="mt-0 mb-3" />

          <div v-if="planList.length === 0" class="text-center py-4">
            <p class="text-secondary mb-0">
              결과서를 작성할 수 있는 승인된 계획서가 없습니다.
            </p>
          </div>

          <div
            v-for="item in planList"
            :key="item.supportPlan_id"
            class="card mb-3 border"
          >
            <div
              class="card-body p-3 d-flex justify-content-between align-items-center"
            >
              <div>
                <h6 class="mb-1 text-sm">
                  지원대상자: {{ item.supportName }}
                  <span class="badge bg-light text-dark ms-2">{{
                    item.wirte_at
                  }}</span>
                </h6>
                <p class="text-xs text-secondary mb-1">
                  담당자:
                  <span class="text-dark font-weight-bold me-2">{{
                    item.managerName
                  }}</span>
                  보호자:
                  <span class="text-dark font-weight-bold">{{
                    item.guardianName
                  }}</span>
                </p>
                <p
                  class="text-xs text-secondary mb-0 text-truncate"
                  style="max-width: 400px"
                >
                  목표: {{ item.purpose }}
                </p>
              </div>
              <button
                class="btn btn-sm btn-outline-primary mb-0"
                @click="selectPlan(item)"
              >
                선택
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
