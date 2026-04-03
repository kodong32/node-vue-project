<template>
  <div class="sidebar-layout-container">
    <div class="sidebar-inner">
      <div class="top-row">
        <h5 class="sidebar-title">상세검색</h5>
        <button type="button" class="reset-btn" @click="resetForm">
          초기화
        </button>
      </div>

      <div class="form-section">
        <label class="form-label">작성일</label>
        <input
          type="date"
          class="custom-input"
          v-model="searchForm.writeDate"
        />
      </div>

      <div class="divider"></div>

      <div class="form-section">
        <label class="form-label">보호자</label>
        <input
          type="text"
          class="custom-input"
          :value="currentUserName"
          readonly
          placeholder="보호자 이름"
        />
      </div>

      <div class="divider"></div>

      <div class="form-section">
        <label class="form-label">담당자</label>
        <input
          type="text"
          class="custom-input"
          v-model="searchForm.managerName"
          placeholder="담당자 이름 검색"
          @keyup.enter="handleSearch"
        />
      </div>

      <button type="button" class="search-btn" @click="handleSearch">
        검색
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import { useUserMainSearchStore } from "@/store/userMainSearch";

const searchStore = useUserMainSearchStore();

const currentUserName = ref("");

const searchForm = reactive({
  writeDate: "",
  managerName: "",
});

const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentUserName.value = response.data.user.name || "";

      // 처음 진입 시 지원자명 store에도 넣어둠
      if (!searchStore.applicantName) {
        searchStore.applicantName = currentUserName.value;
      }
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

const resetForm = () => {
  searchForm.writeDate = "";
  searchForm.managerName = "";

  searchStore.resetSearchCondition(currentUserName.value);
};

const handleSearch = () => {
  searchStore.setSearchCondition({
    writeDate: searchForm.writeDate,
    applicantName: currentUserName.value,
    managerName: searchForm.managerName,
  });
};

onMounted(() => {
  checkSession();
});
</script>

<style scoped>
.sidebar-layout-container {
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow-y: auto;
}

.sidebar-inner {
  padding: 24px 20px 28px;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 12px;
}

.sidebar-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #344767;
}

.reset-btn {
  border: 1px solid #cfd4dc;
  background: #ffffff;
  color: #6c757d;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: #f8f9fa;
}

.form-section {
  margin-bottom: 22px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #8392ab;
}

.custom-input {
  width: 100%;
  height: 46px;
  border: 1px solid #d2d6da;
  border-radius: 12px;
  background: #f8f9fa;
  padding: 0 14px;
  font-size: 0.95rem;
  color: #344767;
  outline: none;
  box-sizing: border-box;
}

.custom-input:focus {
  background: #ffffff;
  border-color: #5e72e4;
  box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.15);
}

.custom-input[readonly] {
  background: #f3f5f7;
  color: #495057;
}

.divider {
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(131, 146, 171, 0.25),
    rgba(0, 0, 0, 0)
  );
  margin: 20px 0;
}

.search-btn {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #2dce89, #2ec5b6);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 8px 20px rgba(46, 197, 182, 0.28);
  transition: all 0.2s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(46, 197, 182, 0.35);
}

.sidebar-layout-container::-webkit-scrollbar {
  width: 6px;
}

.sidebar-layout-container::-webkit-scrollbar-thumb {
  background: rgba(131, 146, 171, 0.35);
  border-radius: 999px;
}
</style>