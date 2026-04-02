<script setup>
import { ref, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import { useRouter } from "vue-router";
import managerPlanCardList from "./components/managerPlanCardList.vue";
import RoleHeader from "./components/RoleHeader.vue";

const router = useRouter();

const planList = ref([]);
const filterType = ref("all"); // all / approved / rejected / pending

const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
});

let searchModalInstance = null;

const getPlanList = async () => {
  const params = new URLSearchParams();

  if (searchFilters.value.managerName?.trim()) {
    params.append("managerName", searchFilters.value.managerName.trim());
  }

  if (searchFilters.value.guardianName?.trim()) {
    params.append("guardianName", searchFilters.value.guardianName.trim());
  }

  if (searchFilters.value.supportName?.trim()) {
    params.append("supportName", searchFilters.value.supportName.trim());
  }

  const queryString = params.toString();
  const url = queryString
    ? `/api/manager/plan/list?${queryString}`
    : `/api/manager/plan/list`;

  const result = await fetch(url).then((res) => res.json());

  if (result.status === "Success") {
    planList.value = result.data;
  } else {
    planList.value = [];
    alert("목록 조회 실패");
  }
};

const filteredPlanList = computed(() => {
  switch (filterType.value) {
    case "approved":
      return planList.value.filter((item) => item.state === "g001");
    case "rejected":
      return planList.value.filter((item) => item.state === "g002");
    case "pending":
      return planList.value.filter((item) => item.state === "g003");
    default:
      return planList.value;
  }
});

const filterTabs = computed(() => [
  { key: "all", label: "전체", count: planList.value.length },
  {
    key: "approved",
    label: "승인",
    count: planList.value.filter((item) => item.state === "g001").length,
  },
  {
    key: "rejected",
    label: "반려",
    count: planList.value.filter((item) => item.state === "g002").length,
  },
  {
    key: "pending",
    label: "미정",
    count: planList.value.filter((item) => item.state === "g003").length,
  },
]);

const showSearchModal = () => {
  if (searchModalInstance) {
    searchModalInstance.show();
  }
};

const goInsertPlan = () => {
  router.push("/manager/insertplan");
};

const applySearch = () => {
  getPlanList();
  if (searchModalInstance) {
    searchModalInstance.hide();
  }
};

const resetSearch = () => {
  searchFilters.value.managerName = "";
  searchFilters.value.guardianName = "";
  searchFilters.value.supportName = "";
  getPlanList();
  if (searchModalInstance) {
    searchModalInstance.hide();
  }
};

const handleEdit = (item) => {
  console.log("수정:", item);
  router.push({
    path: "/manager/editplan",
    query: { id: item.supportPlan_id },
  });
};

const handleDelete = async (id) => {
  if (!confirm("삭제하시겠습니까?")) return;

  try {
    const result = await fetch(`/api/manager/plan/delete/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());

    if (result.status === "Success") {
      alert("삭제 완료");
      await getPlanList();
    } else {
      alert("삭제 실패");
    }
  } catch (err) {
    console.log(err);
    alert("서버 오류");
  }
};

onMounted(() => {
  getPlanList();

  const modalElement = document.getElementById("searchModal");
  if (modalElement) {
    searchModalInstance = new Modal(modalElement);
  }
});
</script>

<template>
  <RoleHeader />

  <div class="mt-4 px-2 px-md-3">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
      <div class="filter-pill-wrap d-flex align-items-center gap-2 flex-wrap">
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          type="button"
          class="filter-pill-btn"
          :class="{ active: filterType === tab.key }"
          @click="filterType = tab.key"
        >
          <span>{{ tab.label }}</span>
          <span class="filter-count">{{ tab.count }}</span>
        </button>
      </div>

      <div class="d-flex align-items-center gap-2 flex-wrap">
        <button class="write-action-btn btn btn-sm mb-0" @click="goInsertPlan">
          <i class="fas fa-pen me-2"></i>작성
        </button>

        <button class="search-action-btn btn btn-sm mb-0" @click="showSearchModal">
          <i class="fas fa-search me-2"></i>상세 검색
        </button>
      </div>
    </div>

    <managerPlanCardList
      :planList="filteredPlanList"
      userRole="manager"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>

  <div
    class="modal fade"
    id="searchModal"
    tabindex="-1"
    aria-labelledby="searchModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
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
            <label class="form-label text-sm font-weight-bold">담당자 이름</label>
            <input
              type="text"
              class="form-control"
              v-model="searchFilters.managerName"
              placeholder="담당자 이름 입력"
            />
          </div>

          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold">보호자 이름</label>
            <input
              type="text"
              class="form-control"
              v-model="searchFilters.guardianName"
              placeholder="보호자 이름 입력"
            />
          </div>

          <div class="mb-0">
            <label class="form-label text-sm font-weight-bold">지원대상자 이름</label>
            <input
              type="text"
              class="form-control"
              v-model="searchFilters.supportName"
              placeholder="지원대상자 이름 입력"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary mb-0" @click="resetSearch">
            초기화
          </button>
          <button type="button" class="btn btn-primary mb-0" @click="applySearch">
            검색
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-pill-wrap {
  padding: 0.4rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(6px);
}

.filter-pill-btn {
  border: none;
  background: transparent;
  color: #495057;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.88rem;
  font-weight: 700;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.filter-pill-btn:hover {
  background: rgba(255, 255, 255, 0.65);
  color: #212529;
}

.filter-pill-btn.active {
  background: #ffffff;
  color: #212529;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.08);
  font-size: 0.75rem;
  font-weight: 700;
}

.filter-pill-btn.active .filter-count {
  background: rgba(0, 0, 0, 0.12);
  color: #212529;
}

.search-action-btn,
.write-action-btn {
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.search-action-btn {
  background: #ffffff;
  color: #344767;
  border: 1px solid rgba(52, 71, 103, 0.18);
}

.search-action-btn:hover {
  background: #344767;
  color: #ffffff;
  border-color: #344767;
  transform: translateY(-1px);
}

.write-action-btn {
  background: #5e72e4;
  color: #ffffff;
  border: 1px solid #5e72e4;
}

.write-action-btn:hover {
  background: #324cdd;
  color: #ffffff;
  border-color: #324cdd;
  transform: translateY(-1px);
}
</style>
