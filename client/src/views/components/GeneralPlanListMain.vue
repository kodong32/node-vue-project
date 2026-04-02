<!-- D:\node-vue-project\client\src\views\components\GeneralPlanListMain.vue -->
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GeneralPlanCardList from "@/views/components/GeneralPlanCardList.vue";
import { Modal } from "bootstrap"; // 💡 여기서 가져온 Modal을 아래 onMounted에서 쓸 거야!

const route = useRoute();

const currentUserRole = ref(route.path.includes("/user") ? "USER" : "GENERAL");

const currentSurveyId = route.params.surveyId || route.query.surveyId || "";

// 상태 변수
const userRole = ref(currentUserRole.value);
const planList = ref([]);
const instiId = ref("INST0000");

// 검색 필터 상태 변수
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
  surveyId: currentSurveyId,
});

// 모달 객체를 담아둘 변수
let searchModalInstance = null;

// 데이터 불러오기 함수
const fetchPlans = async () => {
  try {
    // 💡 3. 역할에 따라 백엔드 API 주소 분기 처리!
    const apiUrl =
      userRole.value === "USER"
        ? "http://localhost:3000/user/plan/list" // 유저용 API (이제 우리가 만들 곳!)
        : "http://localhost:3000/general/plan/list"; // 관리자용 API (이미 잘 도는 곳!)

    const response = await axios.get(apiUrl, {
      params: {
        instiId: instiId.value, // (유저용 API에선 백엔드가 이거 무시할 거니까 냅둬도 돼)
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

// 💡 모달 띄우기 함수
const showSearchModal = () => {
  if (searchModalInstance) {
    searchModalInstance.show();
  }
};

// 검색 적용 함수
const applySearch = () => {
  fetchPlans();
  if (searchModalInstance) {
    searchModalInstance.hide(); // 검색 누르면 모달 닫기
  }
};

// 초기화 함수
const resetSearch = () => {
  searchFilters.value.managerName = "";
  searchFilters.value.guardianName = "";
  searchFilters.value.supportName = "";
  fetchPlans();
  if (searchModalInstance) {
    searchModalInstance.hide(); // 초기화 누르면 모달 닫기
  }
};

onMounted(() => {
  fetchPlans();
  // 💡 여기서 Modal을 드디어 사용함! (에러 사라짐)
  // 화면이 렌더링된 후 id가 'searchModal'인 요소를 Bootstrap 모달로 연결
  const modalElement = document.getElementById("searchModal");
  if (modalElement) {
    searchModalInstance = new Modal(modalElement);
  }
});
</script>

<template>
  <div class="container-fluid py-4">
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
