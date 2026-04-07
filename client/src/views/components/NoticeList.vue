<!-- D:\node-vue-project\client\src\views\components\NoticeList.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import RoleHeader from "./RoleHeader.vue";
import AdminHeader from "@/views/components/adminPageHeader.vue";

// 💡 1. 빈 바구니 준비 (하드코딩 제거)
const currentUserRole = ref("");
const currentInstiId = ref("");

const noticeList = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const limit = ref(10);
const topNotice = ref(null);

const filters = ref({
  sort: "최신순",
  tab: "전체",
  category: "제목",
  keyword: "",
});

// 💡 2. 데이터 불러오기 함수 (기존과 동일)
const fetchNoticeList = async () => {
  try {
    const response = await axios.get("/api/notice/list", {
      params: {
        page: currentPage.value,
        limit: limit.value,
        role: currentUserRole.value, // 세션에서 받아온 진짜 권한 전송!
        instiId: currentInstiId.value, // 세션에서 받아온 진짜 기관ID 전송!
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

// 🌟 3. 세션 확인 및 진짜 정보 세팅 함수 (새로 추가!)
const checkSessionAndFetch = async () => {
  try {
    const response = await axios.get("/api/user/auth/me", {
      withCredentials: true, // 이 옵션을 켜야 8080 포트에서 3000 포트로 세션 쿠키가 날아감!
    });
    if (response.data.isLogin) {
      const user = response.data.user;

      // 공통코드 변환
      if (user.role === "a001") currentUserRole.value = "시스템관리자";
      else if (user.role === "a002") currentUserRole.value = "기관관리자";
      else if (user.role === "a003") currentUserRole.value = "기관담당자";
      else currentUserRole.value = "일반이용자";

      currentInstiId.value = user.institutionId || "";

      // 내 신분증을 발급받은 후 목록을 부른다!
      fetchNoticeList();
    } else {
      alert("로그인이 필요합니다.");
      // router.push("/login"); // 실제 환경에선 로그인 페이지로 이동
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

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

const applySearch = () => {
  currentPage.value = 1;
  fetchNoticeList();
};

const changePage = (page) => {
  currentPage.value = page;
  fetchNoticeList();
};

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / limit.value) || 1;
});

const canWrite = computed(() => {
  return (
    currentUserRole.value === "시스템관리자" ||
    currentUserRole.value === "기관관리자"
  );
});

onMounted(() => {
  // 🌟 화면 켜지면 제일 먼저 세션 확인부터 시작!
  checkSessionAndFetch();
});
</script>

<template>
  <div class="container-fluid py-4">
    <template v-if="currentUserRole !== ''">
      <AdminHeader v-if="currentUserRole === '시스템관리자'" />
      <RoleHeader v-else />
    </template>
    <div class="row mt-4">
      <div class="notice-sidebar-wrapper mb-4">
        <div
          class="card position-sticky sidebar-layout-container shadow"
          style="top: 20px"
        >
          <div class="sidebar-inner">
            <div class="top-row">
              <h5 class="sidebar-title">상세검색</h5>
              <button type="button" class="reset-btn" @click="resetFilters">
                초기화
              </button>
            </div>

            <div class="form-section">
              <label class="form-label">정렬</label>
              <select
                class="custom-input"
                v-model="filters.sort"
                @change="applySearch"
              >
                <option value="최신순">최신순</option>
                <option value="오래된순">오래된순</option>
              </select>
            </div>

            <div class="divider"></div>

            <div class="form-section">
              <label class="form-label">탭</label>
              <select
                class="custom-input"
                v-model="filters.tab"
                @change="applySearch"
              >
                <option value="전체">전체 (시스템+기관)</option>
                <option value="시스템">시스템 공지</option>
                <option value="기관">기관 공지</option>
              </select>
            </div>

            <div class="divider"></div>

            <div class="form-section">
              <label class="form-label">분류</label>
              <select class="custom-input" v-model="filters.category">
                <option value="제목">제목</option>
                <option value="내용">내용</option>
                <option value="제목+내용">제목 + 내용</option>
              </select>
            </div>

            <div class="divider"></div>

            <div class="form-section">
              <label class="form-label">검색어</label>
              <input
                type="text"
                class="custom-input"
                placeholder="검색어를 입력하세요"
                v-model="filters.keyword"
                @keyup.enter="applySearch"
              />
            </div>

            <button type="button" class="search-btn" @click="applySearch">
              검색
            </button>
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
                          item.writer_type === "a001"
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
/* 마우스 올렸을 때 행 배경색 변경 효과 (기존 유지) */
.hover-bg-light:hover {
  background-color: #f8f9fa !important;
  transition: background-color 0.2s ease-in-out;
}
.cursor-pointer {
  cursor: pointer;
}

/* 🌟 여기서부터 팀장님 사이드바 스타일 완벽 복제! */
.sidebar-layout-container {
  width: 100%;
  background: #ffffff;
  border-radius: 18px !important; /* 둥근 테두리 18px로 통일 */
  border: none;
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
  font-size: 1.5rem; /* 살짝 줄여서 비율 맞춤 */
  font-weight: 800;
  color: #344767;
}

.reset-btn {
  border: 1px solid #cfd4dc;
  background: #ffffff;
  color: #6c757d;
  border-radius: 10px;
  padding: 8px 12px;
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

/* 🌟 날씬한 사이드바를 위한 다이어트 CSS */
.notice-sidebar-wrapper {
  width: 280px; /* 팀장님 사이드바 두께와 100% 동일하게 고정 */
  flex: 0 0 280px;
  padding-right: 1.5rem; /* 오른쪽 본문(목록)과의 간격 */
}

/* 화면이 좁아질 때(태블릿/모바일)는 다시 100%로 꽉 차게 반응형 처리 */
@media (max-width: 991.98px) {
  .notice-sidebar-wrapper {
    width: 100%;
    flex: 0 0 100%;
    padding-right: calc(var(--bs-gutter-x) * 0.5);
  }
}
</style>
