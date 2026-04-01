<template>
  <consultTop />
  <div class="consultation-container">
    <div class="table-title-box">
      <h5 class="table-title">📄 상담 기록 리스트</h5>
    </div>
    <section class="search-filter-box">
      <div class="filter-row">
        <div class="input-item">
          <label>기관담당자 :</label>
          <select class="form-select" v-model="filters.manager">
            <option value="">전체</option>
            <option
              v-for="manager in managerList"
              :key="manager.id"
              :value="manager.id"
            >
              {{ manager.name }}
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
          />
          <button class="btn-search" @click="applyFilter">검색</button>
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
          <tr
            v-for="(info, index) in filteredConsults"
            :key="info.counsult_id"
            v-on:click="goToDetail(info.counsult_id)"
          >
            <td>{{ index + 1 }}</td>
            <td class="fw-bold">{{ info.user_name }}</td>
            <td class="text-secondary">{{ dateFormat(info.counsult_date) }}</td>
            <td>{{ info.counsult_method }}</td>
            <td>{{ info.counsult_loc }}</td>
            <td class="content-cell text-start">{{ info.counsult_content }}</td>
            <td class="manager-cell">
              <div>정 : {{ info.name }}</div>
              <div class="text-muted">부 : {{ info.name }}</div>
            </td>

            <td>
              <div class="action-buttons">
                <button class="btn-outline-edit">수정</button>
                <button class="btn-outline-delete">삭제</button>
              </div>
            </td>
          </tr>
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
import { useRouter } from "vue-router";

const consults = ref([]);
const router = useRouter();
const managerList = ref([]);
const consultList = ref([]);

// // 검색 필터 데이터
const filters = ref({
  manager: "",
  type: "all",
  startDate: "",
  endDate: "",
  userName: "",
});

const consultAll = async () => {
  let list = await fetch("http://localhost:3000/consult/user")
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

  consults.value = list;

  const unique = [
    ...new Map(
      list.map((c) => [c.I_UserId, { id: c.I_UserId, name: c.name }]),
    ).values(),
  ];
  managerList.value = unique;

  const uniqueMethods = [...new Set(list.map((c) => c.counsult_method))];
  consultList.value = uniqueMethods;
};

onBeforeMount(async () => {
  await consultAll();
});

const goToDetail = (counsultId) => {
  router.push({ name: "consultList", params: { no: counsultId } });
};

const dateFormat = (dateVal) => {
  let newDate = new Date(dateVal);

  let year = newDate.getFullYear();
  let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
  let day = ("0" + newDate.getDate()).slice(-2);
  let hours = ("0" + newDate.getHours()).slice(-2);
  let minutes = ("0" + newDate.getMinutes()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const filteredConsults = computed(() => {
  return consults.value.filter((c) => {
    // 1. 기관담당자 필터
    if (filters.value.manager && c.I_UserId !== filters.value.manager)
      return false;
    // 2. 상담유형 필터
    if (
      filters.value.type !== "all" &&
      c.counsult_method !== filters.value.type
    )
      return false;
    // 3. 기간 필터: 시작일과 종료일이 '둘 다' 있을 때만 검사
    if (filters.value.startDate && filters.value.endDate) {
      const consultDate = new Date(c.counsult_date);
      const start = new Date(filters.value.startDate);
      const end = new Date(filters.value.endDate);
      end.setHours(23, 59, 59);
      if (consultDate < start || consultDate > end) return false;
    }

    // 4. 이름 검색 필터
    if (filters.value.userName && !c.user_name.includes(filters.value.userName))
      return false;

    return true;
  });
});

const applyFilter = () => {
  console.log("검색 필터 적용:", filters.value);
};
</script>

<style scoped>
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
</style>
