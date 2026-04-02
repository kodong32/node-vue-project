<!-- D:\node-vue-project\client\src\views\components\NoticeList.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";
// import { useRouter } from "vue-router";
import axios from "axios";

// const router = useRouter();

// 💡 1. 사용자 권한 임시 하드코딩 (나중에는 Vuex나 localStorage에서 가져와야 해!)
// 테스트할 때 이 값을 "일반이용자", "기관담당자", "기관관리자", "시스템관리자" 로 바꿔보면서 테스트해봐!
const currentUserRole = ref("시스템관리자");
const currentInstiId = ref("INST0000"); // 기관 소속일 경우 기관 ID

// 💡 2. 상태 관리 변수들
const noticeList = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const limit = ref(10);
const topNotice = ref(null);

// 검색 및 필터 조건
const filters = ref({
  sort: "최신순",
  tab: "전체", // 전체, 시스템, 기관
  category: "제목", // 제목, 내용, 제목+내용
  keyword: "",
});

// 💡 3. 데이터 불러오기 함수
const fetchNoticeList = async () => {
  try {
    const response = await axios.get("http://localhost:3000/notice/list", {
      params: {
        page: currentPage.value,
        limit: limit.value,
        role: currentUserRole.value,
        instiId: currentInstiId.value,
        sort: filters.value.sort,
        tab: filters.value.tab,
        category: filters.value.category,
        keyword: filters.value.keyword,
      },
    });
    noticeList.value = response.data.data;
    totalCount.value = response.data.totalCount;
    topNotice.value = response.data.topNotice;
  } catch (error) {
    console.error("공지사항을 불러오는 중 오류 발생:", error);
  }
};

// 💡 4. 필터 초기화
const resetFilters = () => {
  filters.value = {
    sort: "최신순",
    tab: "전체",
    category: "제목",
    keyword: "",
  };
  currentPage.value = 1;
  fetchNoticeList();
};

// 검색 실행
const applySearch = () => {
  currentPage.value = 1;
  fetchNoticeList();
};

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page;
  fetchNoticeList();
};

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(totalCount.value / limit.value) || 1;
});

// 권한에 따른 글쓰기 버튼 노출 여부
const canWrite = computed(() => {
  return (
    currentUserRole.value === "시스템관리자" ||
    currentUserRole.value === "기관관리자"
  );
});

// 화면이 켜질 때 데이터 1회 로드
onMounted(() => {
  fetchNoticeList();
});
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-lg-3 col-md-4 mb-4">
        <div class="card position-sticky top-1">
          <div
            class="card-header pb-0 d-flex justify-content-between align-items-center"
          >
            <h6 class="mb-0">상세검색</h6>
            <button
              class="btn btn-link text-secondary mb-0 p-0"
              @click="resetFilters"
            >
              <i class="fas fa-redo-alt me-1"></i> 초기화
            </button>
          </div>
          <div class="card-body pt-3">
            <div class="form-group mb-3">
              <label class="text-xs font-weight-bold text-secondary mb-1"
                >정렬</label
              >
              <select
                class="form-select text-sm"
                v-model="filters.sort"
                @change="applySearch"
              >
                <option value="최신순">최신순</option>
                <option value="오래된순">오래된순</option>
              </select>
            </div>

            <div class="form-group mb-3">
              <label class="text-xs font-weight-bold text-secondary mb-1"
                >탭</label
              >
              <select
                class="form-select text-sm"
                v-model="filters.tab"
                @change="applySearch"
              >
                <option value="전체">전체 (시스템+기관)</option>
                <option value="시스템">시스템 공지</option>
                <option value="기관">기관 공지</option>
              </select>
            </div>

            <div class="form-group mb-3">
              <label class="text-xs font-weight-bold text-secondary mb-1"
                >분류</label
              >
              <select class="form-select text-sm" v-model="filters.category">
                <option value="제목">제목</option>
                <option value="내용">내용</option>
                <option value="제목+내용">제목 + 내용</option>
              </select>
            </div>

            <div class="form-group mb-3">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control text-sm"
                  placeholder="검색어를 입력하세요"
                  v-model="filters.keyword"
                  @keyup.enter="applySearch"
                />
                <button
                  class="btn btn-outline-primary mb-0"
                  type="button"
                  @click="applySearch"
                >
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-9 col-md-8">
        <div class="card">
          <div
            class="card-header pb-0 d-flex justify-content-between align-items-center"
          >
            <h6 class="mb-0">공지사항 목록</h6>
            <button
              v-if="canWrite"
              class="btn btn-primary btn-sm mb-0"
              @click="$router.push('/notice/write')"
            >
              <i class="fas fa-pen me-1"></i> 공지 작성
            </button>
          </div>

          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-15"
                    >
                      탭
                    </th>
                    <th
                      class="text-left text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-40"
                    >
                      제목
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-20"
                    >
                      글쓴이
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-25"
                    >
                      작성일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-if="topNotice"
                    class="cursor-pointer"
                    style="background-color: #e8f5e9"
                    @click="
                      $router.push(`/notice/detail/${topNotice.notice_id}`)
                    "
                  >
                    <td class="align-middle text-center">
                      <span class="badge bg-gradient-danger badge-sm"
                        >시스템</span
                      >
                    </td>

                    <td class="align-middle text-left px-3">
                      <p class="text-sm mb-0 font-weight-bolder text-dark">
                        <i
                          v-if="topNotice.isImportant"
                          class="fas fa-thumbtack text-primary me-2"
                        ></i>
                        {{ topNotice.title }}
                        <span class="text-danger ms-1">*</span>
                      </p>
                    </td>

                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold"
                        >시스템관리자</span
                      >
                    </td>

                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">{{
                        topNotice.create_at
                      }}</span>
                    </td>
                  </tr>
                  <tr v-if="noticeList.length === 0">
                    <td
                      colspan="4"
                      class="text-center py-4 text-sm text-secondary"
                    >
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>

                  <tr
                    v-for="item in noticeList"
                    :key="item.notice_id"
                    class="cursor-pointer hover-bg-light"
                    @click="$router.push(`/notice/detail/${item.notice_id}`)"
                  >
                    <td class="align-middle text-center">
                      <span
                        class="badge badge-sm"
                        :class="
                          item.notice_type === 'ALL'
                            ? 'bg-gradient-danger'
                            : 'bg-gradient-info'
                        "
                      >
                        {{ item.notice_type === "ALL" ? "시스템" : "기관" }}
                      </span>
                    </td>

                    <td class="align-middle text-left px-3">
                      <p
                        class="text-sm mb-0"
                        :class="{
                          'font-weight-bolder text-primary': item.isImportant,
                        }"
                      >
                        <i
                          v-if="item.isImportant"
                          class="fas fa-thumbtack text-primary me-2"
                        ></i>
                        {{ item.title }}
                      </p>
                    </td>

                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">
                        {{
                          item.notice_type === "ALL"
                            ? "시스템관리자"
                            : "기관관리자"
                        }}
                      </span>
                    </td>

                    <td class="align-middle text-center">
                      <span class="text-secondary text-xs font-weight-bold">{{
                        item.create_at
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              class="d-flex justify-content-center mt-4"
              v-if="totalPages > 1"
            >
              <nav aria-label="Page navigation">
                <ul class="pagination pagination-primary mb-0">
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === 1 }"
                  >
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(currentPage - 1)"
                    >
                      <i class="fa fa-angle-left"></i>
                    </a>
                  </li>
                  <li
                    class="page-item"
                    v-for="page in totalPages"
                    :key="page"
                    :class="{ active: currentPage === page }"
                  >
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(page)"
                      >{{ page }}</a
                    >
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === totalPages }"
                  >
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(currentPage + 1)"
                    >
                      <i class="fa fa-angle-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 마우스 올렸을 때 행 배경색 변경 효과 */
.hover-bg-light:hover {
  background-color: #f8f9fa !important;
  transition: background-color 0.2s ease-in-out;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
