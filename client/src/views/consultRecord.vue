<template>
  <RoleHeader />
  <div class="consultation-container">
    <div class="table-title-box">
      <h5 class="table-title">📄 상담 기록 리스트</h5>
    </div>
    <section class="search-filter-box">
      <div class="filter-row">
        <div class="input-item">
          <label>지원대상자 :</label>
          <select class="form-select" v-model="filters.manager">
            <option value="">전체</option>
            <option
              v-for="support in supportList"
              :key="support.id"
              :value="support.id"
            >
              {{ support.support_name }}
            </option>
          </select>
        </div>

        <div class="input-item">
          <label>상담유형 :</label>
          <select class="form-select" v-model="filters.type">
            <option value="all">전체</option>
            <option
              v-for="(method, index) in consultList"
              :key="index"
              :value="method"
            >
              {{ method }}
            </option>
          </select>
        </div>

        <div class="input-item">
          <label>기간 :</label>
          <div class="date-group">
            <input
              type="date"
              class="form-input date"
              v-model="filters.startDate"
            />
            <span class="date-separator">~</span>
            <input
              type="date"
              class="form-input date"
              v-model="filters.endDate"
            />
          </div>
        </div>

        <div class="search-group ms-auto">
          <input
            type="text"
            v-model="filters.userName"
            placeholder="지원대상자 이름 검색"
            class="form-input search-input"
            @keyup.enter="applyFilter"
          />
          <button class="btn-search" @click="applyFilter">검색</button>
          <button class="btn-reset" @click="resetFilter">초기화</button>
        </div>
      </div>
    </section>

    <section class="table-container">
      <table class="consultation-table">
        <thead>
          <tr>
            <th width="60">번호</th>
            <th width="120">지원대상자명</th>
            <th width="180">상담일시</th>
            <th width="100">상담유형</th>
            <th width="100">상담장소</th>
            <th>상담내용</th>
            <th width="140">기관 담당자</th>
            <th width="120">수정/삭제</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="group in paginatedGroups" :key="group.support_id">
            <tr class="group-header">
              <!-- <td colspan="8" class="fw-bold bg-light">
                {{ group.support_name }} ({{ group.user_name }})
              </td> -->
            </tr>

            <tr
              v-for="(info, index) in group.list"
              :key="info.counsult_id"
              @click="goToDetail(info.counsult_id)"
            >
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>

              <td>{{ info.user_name }}</td>
              <td>
                {{ dateFormat(info.counsult_date, info.counsult_startTime) }}
              </td>

              <td>{{ info.counsult_method }}</td>
              <td>{{ info.counsult_loc }}</td>

              <td style="text-align: left">
                [기본요약]: {{ info.counsult_content }}<br />
                [상담내용]: {{ info.counsult_content2 }}<br />
                [서비스욕구]: {{ info.counsult_content3 }}<br />
                [종합의견]: {{ info.counsult_content4 }}
              </td>
              <td>
                <div>
                  <span
                    :style="{
                      color: info.manager_type === '정' ? 'green' : 'orange',
                      fontWeight: 'bold',
                    }"
                  >
                    {{ info.manager_type }}
                  </span>
                  : {{ info.name }}
                </div>
              </td>

              <td>
                <button class="btn-outline-edit">수정</button>
                <button class="btn-outline-delete">삭제</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>

    <footer class="list-footer">
      <div class="pagination">
        <span
          class="page-nav"
          @click="changePage(currentPage - 1)"
          :class="{ disabled: currentPage === 1 }"
          >◀</span
        >

        <span
          v-for="page in displayedPages"
          :key="page"
          class="page-num"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </span>

        <span
          class="page-nav"
          @click="changePage(currentPage + 1)"
          :class="{ disabled: currentPage === totalPages }"
          >▶</span
        >
      </div>
      <router-link
        :to="{ name: 'managerConsultAdd' }"
        custom
        v-slot="{ navigate }"
      >
        <button class="btn-register" @click="navigate" role="link">등록</button>
      </router-link>
    </footer>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue";
import RoleHeader from "./components/RoleHeader.vue";
import { useRouter } from "vue-router";

const consults = ref([]);
const router = useRouter();
const supportList = ref([]);
const consultList = ref([]);

// 페이지 갯수 제한
const currentPage = ref(1);
const pageSize = 5;

// // 검색 필터 입력용
const filters = ref({
  manager: "",
  type: "all",
  startDate: "",
  endDate: "",
  userName: "",
});

//실제 적용되는 필터
const appliedFilters = ref({
  manager: "",
  type: "all",
  startDate: "",
  endDate: "",
  userName: "",
});

//전체 데이터 가져오기
const consultAll = async () => {
  try {
    const resp = await fetch("/api/consult/user", {
      credentials: "include",
    });

    if (!resp.ok) {
      const errData = await resp.json();
      throw new Error(errData.message || "서버 오류");
    }

    const list = await resp.json();

    const data = list.data || [];

    consults.value = data;

    // 담당자 리스트 생성
    const unique = [
      ...new Map(
        consults.value.map((c) => [
          c.support_id,
          {
            id: c.support_id,
            support_name: c.user_name,
            name: c.user_name,
          },
        ]),
      ).values(),
    ];
    supportList.value = unique;

    // 상담유형 리스트
    const uniqueMethods = [
      ...new Set(consults.value.map((c) => c.counsult_method)),
    ];
    consultList.value = uniqueMethods;
  } catch (err) {
    console.log(err);
    consults.value = [];
    supportList.value = [];
    consultList.value = [];
  }
};

// 로그인한 사용자 ID
const currentUserId = ref("");

// 예: onBeforeMount에서 서버로부터 로그인 정보 가져오기
onBeforeMount(async () => {
  //로그인한 사용자 정보
  try {
    const authResp = await fetch("/api/auth/me", { credentials: "include" });
    if (authResp.ok) {
      const authData = await authResp.json();
      currentUserId.value = authData.user?.I_UserId || "";
    }
  } catch (err) {
    console.log("auth/me error:", err);
  }

  //전체 상담 데이터
  await consultAll();
});

//건별조회 가능한 함수
const goToDetail = (counsultId) => {
  router.push({ name: "managerDetail", params: { no: counsultId } });
};

//날짜 형식
const dateFormat = (dateVal, timeVal) => {
  if (!dateVal) return "-";

  let newDate = new Date(dateVal);
  let year = newDate.getFullYear();
  let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
  let day = ("0" + newDate.getDate()).slice(-2);

  let time = timeVal ? timeVal : "00:00";

  return `${year}-${month}-${day} ${time}`;
};

//필터처리filteredConsults
const filteredConsults = computed(() => {
  return consults.value.filter((c) => {
    // 로그인한 사용자 필터
    if (currentUserId.value && c.I_UserId !== currentUserId.value) return false;

    // 지원대상자 필터
    if (
      appliedFilters.value.manager &&
      c.support_id !== appliedFilters.value.manager
    )
      return false;

    // 상담유형 필터
    if (
      appliedFilters.value.type !== "all" &&
      c.counsult_method !== appliedFilters.value.type
    )
      return false;

    // 기간 필터
    if (appliedFilters.value.startDate && appliedFilters.value.endDate) {
      const consultDate = new Date(c.counsult_date);
      const start = new Date(appliedFilters.value.startDate);
      const end = new Date(appliedFilters.value.endDate);
      end.setHours(23, 59, 59);
      if (consultDate < start || consultDate > end) return false;
    }

    // 이름 필터
    if (
      appliedFilters.value.userName &&
      !c.user_name.includes(appliedFilters.value.userName)
    )
      return false;

    return true;
  });
});

//지원대상자 그룹화
const groupedConsults = computed(() => {
  const map = {};

  filteredConsults.value.forEach((item) => {
    const key = item.support_id;

    if (!map[key]) {
      map[key] = {
        support_id: item.support_id,
        support_name: item.support_name,
        user_name: item.user_name,
        list: [],
      };
    }

    map[key].list.push(item);
  });

  return Object.values(map);
});

//그룹 기준 페이징
const paginatedGroups = computed(() => {
  const result = [];
  let count = 0; // 현재 페이지에 들어간 건수
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 전체 그룹 순회
  for (const group of groupedConsults.value) {
    const newGroup = { ...group, list: [] };

    for (const item of group.list) {
      if (count >= startIndex && count < endIndex) {
        newGroup.list.push(item);
      }
      count++;
      if (count >= endIndex) break;
    }

    if (newGroup.list.length > 0) {
      result.push(newGroup);
    }

    if (count >= endIndex) break;
  }

  return result;
});

// 그룹 기준 총페이지
const totalPages = computed(() => {
  return Math.ceil(filteredConsults.value.length / pageSize);
});

//페이지 번호 리스트
const displayedPages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1);
});

//페이지 변경
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const applyFilter = () => {
  console.log("검색 필터 적용:", filters.value);

  //입력값 → 실제 필터로 복사
  appliedFilters.value = { ...filters.value };

  currentPage.value = 1;
};

//초기화 버튼
const resetFilter = () => {
  filters.value = {
    manager: "",
    type: "all",
    startDate: "",
    endDate: "",
    userName: "",
  };

  appliedFilters.value = {
    manager: "",
    type: "all",
    startDate: "",
    endDate: "",
    userName: "",
  };

  currentPage.value = 1;
};
</script>

<style scoped>
.btn-reset {
  background-color: #1a681ad1;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 6px;
}

.consultation-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-width: 1000px;
  text-align: center;
}

/* 검색 필터 박스 가로 정렬 */
.search-filter-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 25px; /* 항목 간 간격 */
  flex-wrap: nowrap;
}

.input-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-item label {
  font-weight: bold;
  font-size: 0.9rem;
  color: #344767;
  white-space: nowrap;
}

.date-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 입력창 공통 스타일 */
.form-input,
.form-select {
  border: 1px solid #d2d6da;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  min-width: 100px;
}

.small {
  width: 100px;
}
.date {
  width: 140px;
}
.search-input {
  width: 200px;
}

/* 검색 버튼 */
.btn-search {
  background-color: #1a681ad1;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.ms-auto {
  margin-left: auto;
}

/* 테이블 스타일 */
.table-title-box {
  text-align: center;
  /* margin: 20px; */
  padding: 20px;
}

.table-title {
  font-weight: bold;
  color: #2d6a4f;
  font-size: 30px;
}

.consultation-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.consultation-table th {
  background-color: #1a681ad1;
  color: white;
  padding: 12px;
  font-size: 0.9rem;
}

.consultation-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 0.85rem;
}

/* 수정/삭제 버튼 */
.action-buttons {
  display: flex !important;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.btn-outline-edit,
.btn-outline-delete {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  background: white;
  border: 1px solid #d2d6da;
  cursor: pointer;
  white-space: nowrap;
  min-width: 50px;
}

.btn-outline-edit:hover {
  border-color: #2d6a4f;
  color: #2d6a4f;
}
.btn-outline-delete:hover {
  border-color: #d9534f;
  color: #d9534f;
}

/* 등록 버튼 */
.btn-register {
  background: white;
  border: 2px solid #333;
  padding: 8px 25px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
}

.list-footer {
  display: flex;
  justify-content: center; /* 페이징 번호를 가로 중앙으로 */
  align-items: center; /* 세로 중앙 정렬 */
  position: relative; /* 버튼 위치 고정을 위한 기준점 */
  width: 100%;
  margin-top: 30px;
  padding: 10px 0;
}

.pagination {
  display: flex;
  gap: 8px; /* 번호 사이 간격 */
  align-items: center;
}

.btn-register {
  position: absolute; /* 페이징 순서에서 빠져나와 공중부양 */
  right: 0; /* 오른쪽 끝에 딱 붙임 */
  background: white;
  border: 2px solid #333;
  padding: 8px 25px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
}

/* 페이징 번호 디자인 살짝 추가 */
.page-num,
.page-nav {
  cursor: pointer;
  padding: 5px 12px;
  font-size: 0.9rem;
}

.page-num.active {
  background-color: #287b28;
  color: white;
  border-radius: 4px;
  font-weight: bold;
}

.content-cell {
  line-height: 1.2;
  font-size: 0.8rem;
}

.content-cell div {
  margin: 0;
  padding: 0;
}
</style>
