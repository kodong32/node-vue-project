<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import AuthorsTable from "./components/AuthorsMainTable.vue";
import MainPagination from "../components/MainPagination.vue";
import RoleHeader from "./components/RoleHeader.vue";
import { useGeneralMainSearchStore } from "@/store/generalMainSearch";

const searchStore = useGeneralMainSearchStore();

const listData = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);

const currentInstiId = ref("");
const currentUserName = ref("");

const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentInstiId.value = response.data.user.institutionId;
      currentUserName.value = response.data.user.name;
    } else {
      alert("로그인이 필요합니다.");
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

const fetchSurveyList = async (page = 1) => {
  if (!currentInstiId.value) return;

  try {
    const response = await axios.get(
      `/api/main/general/${currentInstiId.value}`,
      {
        params: {
          page: page,
          limit: 5,
          writeDate: searchStore.writeDate,
          applicantName: searchStore.applicantName,
          managerId: searchStore.managerId,
          managerName: searchStore.managerName,
        },
      },
    );

    listData.value = response.data.data || [];
    totalCount.value = response.data.totalCount || 0;
    currentPage.value = page;
  } catch (error) {
    console.error("기관 관리자 데이터 통신 에러:", error);
  }
};

onMounted(async () => {
  await checkSession();
  if (currentInstiId.value) {
    await fetchSurveyList(1);
  }
});

watch(
  () => searchStore.searchTrigger,
  async () => {
    if (currentInstiId.value) {
      await fetchSurveyList(1);
    }
  },
);

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
          userRole="GENERAL"
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