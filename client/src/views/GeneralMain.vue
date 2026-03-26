<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AuthorsTable from "./components/AuthorsMainTableTest.vue";
// 💡 방금 만든 자동화 페이징 컴포넌트 불러오기 (경로 주의!)
import MainPagination from "../components/MainPagination.vue";

// 💡 상태 바구니 3형제 준비
const listData = ref([]); // 표에 그릴 10개 알맹이 데이터
const totalCount = ref(0); // 전체 데이터 개수 (페이징용)
const currentPage = ref(1); // 현재 보고 있는 페이지 번호

// 데이터를 가져오는 함수 (인자로 페이지 번호를 받음)
const fetchSurveyList = async (page = 1) => {
  try {
    // 💡 백엔드에 ?page=번호 형태로 요청 날리기!
    const response = await axios.get(
      "http://localhost:3000/main/general/INST0000",
      {
        params: { page: page, limit: 5 },
      },
    );

    // 💡 백엔드가 준 포장지({ data, totalCount }) 뜯어서 각 바구니에 담기
    listData.value = response.data.data; // 10개짜리 배열
    totalCount.value = response.data.totalCount; // 총 개수 숫자
    currentPage.value = page; // 화면에 현재 페이지 갱신
  } catch (error) {
    console.error("기관 관리자 데이터 통신 에러:", error);
  }
};

// 화면 켜질 때 1페이지 데이터 가져오기
onMounted(() => {
  fetchSurveyList(1);
});

// 💡 하단 페이징 컴포넌트에서 "2번 버튼 눌렀어요!" 하고 신호가 오면 실행됨
const handlePageChange = (newPage) => {
  fetchSurveyList(newPage); // 해당 페이지 번호로 백엔드 다시 찌르기!
};
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <authors-table :surveyList="listData" userRole="GENERAL" />

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
