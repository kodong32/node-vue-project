<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AuthorsTable from "./components/AuthorsMainTable.vue";
import MainPagination from "../components/MainPagination.vue";
import RoleHeader from "./components/RoleHeader.vue";

const listData = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);

// 🌟 1. 진짜 정보 바구니
const currentUserId = ref("");
const currentUserName = ref("");

// 🌟 2. 세션 확인 함수
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      // 일반 이용자의 고유 ID 가져오기
      currentUserId.value = response.data.user.userId;
      currentUserName.value = response.data.user.name;
    } else {
      alert("로그인이 필요합니다.");
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

const fetchSurveyList = async (page = 1) => {
  if (!currentUserId.value) return; // ID 없으면 중지

  try {
    // 🌟 3. 하드코딩된 GUSR0009 대신 변수 사용 및 /api 적용
    const response = await axios.get(`/api/main/user/${currentUserId.value}`, {
      params: { page: page, limit: 5 },
    });

    listData.value = response.data.data;
    totalCount.value = response.data.totalCount;
    currentPage.value = page;
  } catch (error) {
    console.error("일반 이용자 데이터 통신 에러:", error);
  }
};

onMounted(async () => {
  // 🌟 4. 세션부터 확인 후 데이터 로출
  await checkSession();
  if (currentUserId.value) {
    fetchSurveyList(1);
  }
});

const handlePageChange = (newPage) => {
  fetchSurveyList(newPage);
};
</script>

<template>
  <div class="py-4 container-fluid">
    <RoleHeader />

    <div class="row">
      <div class="col-12">
        <authors-table
          :surveyList="listData"
          userRole="USER"
          :totalCount="totalCount"
          :currentPage="currentPage"
          :limit="5"
        />

        <main-pagination
          :totalCount="totalCount"
          :limit="5"
          :currentPage="currentPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
