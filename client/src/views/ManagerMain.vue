<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AuthorsTable from "./components/AuthorsMainTable.vue";
import MainPagination from "../components/MainPagination.vue";
import RoleHeader from "./components/RoleHeader.vue";

// 💡 상태 바구니 준비
const listData = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);

// 🌟 1. 내 진짜 정보를 담을 바구니 추가! (하드코딩 제거용)
const currentUserId = ref("");
const currentUserName = ref("");

// 🌟 2. 세션에서 내 진짜 정보 꺼내오는 함수
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      // 내 진짜 아이디와 이름을 바구니에 담기
      currentUserId.value = response.data.user.userId;
      currentUserName.value = response.data.user.name;
    } else {
      alert("로그인이 필요합니다.");
      // location.href = "/user/login"; // 필요 시 로그인 창으로 이동
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

// 데이터를 가져오는 함수 (인자로 페이지 번호를 받음)
const fetchSurveyList = async (page = 1) => {
  // 내 아이디가 없으면 백엔드 요청을 보내지 않음 (방어 코드)
  if (!currentUserId.value) return;

  try {
    // 🌟 3. 하드코딩 제거! "IUSR0003" 대신 `${currentUserId.value}` 변수 사용!
    // 프록시 설정에 맞게 /api 로 시작하도록 수정
    const response = await axios.get(
      `/api/main/manager/${currentUserId.value}`,
      {
        params: { page: page, limit: 5 },
      },
    );

    listData.value = response.data.data;
    totalCount.value = response.data.totalCount;
    currentPage.value = page;
  } catch (error) {
    console.error("기관 담당자 데이터 통신 에러:", error);
  }
};

// 화면 켜질 때 실행
onMounted(async () => {
  // 🌟 4. 무조건 세션부터 확인해서 내 ID를 먼저 알아낸 다음!
  await checkSession();

  // 내 ID를 알아냈다면 1페이지 데이터를 가져오기!
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
          userRole="MANAGER"
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
