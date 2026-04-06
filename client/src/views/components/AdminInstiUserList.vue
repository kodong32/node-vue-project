<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import AdminHeader from "./adminPageHeader.vue";
import MainPagination from "@/components/MainPagination.vue";

const userList = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const selectedIds = ref([]);

// 🔍 검색 및 필터 상태
const searchKeyword = ref("");
const isWaitOnly = ref(false); // 대기 토글
// 🌟 역할 필터(selectedRole) 변수 삭제 완료!

const fetchUserList = async (page = 1) => {
  try {
    const response = await axios.get("/api/admin/instiuser/list", {
      params: {
        page: page,
        limit: 10,
        name: searchKeyword.value || null,
        isWaitOnly: isWaitOnly.value,
        // 🌟 role 파라미터 전송 삭제 완료!
      },
    });
    userList.value = response.data.data || [];
    totalCount.value = response.data.data.length || 0;
    currentPage.value = page;
  } catch (error) {
    console.error("목록 조회 에러:", error);
  }
};

// 🌟 역할 필터가 사라졌으므로 watch에서도 제거 완료!
watch([isWaitOnly], () => {
  fetchUserList(1);
});

const applySearch = () => fetchUserList(1);
const handlePageChange = (newPage) => fetchUserList(newPage);

const toggleSelectAll = (event) => {
  selectedIds.value = event.target.checked
    ? userList.value.map((item) => item.user_id)
    : [];
};

// 선택 승인 (등록 버튼)
const approveSelected = async () => {
  if (selectedIds.value.length === 0)
    return alert("승인할 관리자를 선택해주세요.");
  if (!confirm(`선택한 ${selectedIds.value.length}명을 승인하시겠습니까?`))
    return;

  try {
    await axios.put("/api/admin/instiuser/approve", { ids: selectedIds.value });
    alert("승인이 완료되었습니다.");
    selectedIds.value = [];
    fetchUserList(currentPage.value);
  } catch (error) {
    alert("승인 처리 중 오류가 발생했습니다.");
  }
};

// 선택 삭제
const deleteSelected = async () => {
  if (selectedIds.value.length === 0)
    return alert("삭제할 관리자를 선택해주세요.");
  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    await axios.delete("/api/admin/instiuser", {
      data: { ids: selectedIds.value },
    });
    alert("삭제가 완료되었습니다.");
    selectedIds.value = [];
    fetchUserList(currentPage.value);
  } catch (error) {
    alert("삭제 중 오류가 발생했습니다.");
  }
};

// 🌟 모달 관련 상태 변수
const isModalOpen = ref(false);
const editForm = ref({
  userId: "",
  id: "", // 아이디 (수정불가용)
  name: "",
  tel: "",
});

// 🌟 모달 열기 (클릭한 줄의 데이터를 폼에 복사)
const openEditModal = (item) => {
  editForm.value = {
    userId: item.user_id,
    id: item.id,
    name: item.name,
    tel: item.tel,
  };
  isModalOpen.value = true; // 모달 띄우기!
};

// 🌟 모달 닫기
const closeEditModal = () => {
  isModalOpen.value = false;
};

// 🌟 수정 데이터 서버로 전송
const submitEdit = async () => {
  if (!confirm("이대로 수정하시겠습니까?")) return;

  try {
    await axios.put("/api/admin/instiuser/edit", editForm.value);
    alert("수정이 완료되었습니다.");
    closeEditModal(); // 모달 닫기
    fetchUserList(currentPage.value); // 목록 새로고침
  } catch (error) {
    alert("수정 중 오류가 발생했습니다.");
  }
};

onMounted(() => fetchUserList(1));
</script>

<template>
  <div class="py-4 container-fluid">
    <AdminHeader />

    <div class="row mt-4">
      <div class="col-12">
        <div class="card mb-4">
          <div
            class="card-header pb-0 d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center gap-3">
              <h6 class="mb-0">기관관리자 정보</h6>

              <div
                class="form-check form-switch mb-0 d-flex align-items-center"
              >
                <input
                  class="form-check-input mt-0 me-2"
                  type="checkbox"
                  id="waitToggle"
                  v-model="isWaitOnly"
                  @change="applySearch"
                />
                <label class="form-check-label mb-0 text-sm" for="waitToggle"
                  >대기</label
                >
              </div>
            </div>

            <div class="d-flex gap-2">
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="기관명 검색"
                v-model="searchKeyword"
                @keyup.enter="applySearch"
                style="width: 200px"
              />
              <button
                class="btn btn-outline-primary btn-sm mb-0"
                @click="applySearch"
              >
                검색
              </button>
              <button
                class="btn btn-outline-secondary btn-sm mb-0"
                @click="deleteSelected"
              >
                선택삭제
              </button>
            </div>
          </div>

          <div class="card-body px-0 pt-0 pb-2 mt-3">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        @change="toggleSelectAll($event)"
                      />
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      번호
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      이름
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      아이디
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      기관명
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      연락처
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      사용승인
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      수정
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="userList.length === 0">
                    <td
                      colspan="8"
                      class="text-center py-4 text-secondary text-sm"
                    >
                      등록된 기관관리자가 없습니다.
                    </td>
                  </tr>
                  <tr v-for="(item, index) in userList" :key="item.user_id">
                    <td class="align-middle text-center">
                      <div class="form-check d-flex justify-content-center">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :value="item.user_id"
                          v-model="selectedIds"
                          :disabled="item.state === '승인'"
                        />
                      </div>
                    </td>
                    <td class="align-middle text-center text-secondary text-xs">
                      {{ totalCount - (currentPage - 1) * 10 - index }}
                    </td>
                    <td class="align-middle text-center text-sm">
                      <h6 class="mb-0 text-sm">{{ item.name }}</h6>
                    </td>
                    <td class="align-middle text-center text-xs">
                      <p class="mb-0">{{ item.id }}</p>
                    </td>
                    <td class="align-middle text-center text-xs">
                      <p class="mb-0">{{ item.institution_name }}</p>
                    </td>
                    <td class="align-middle text-center text-xs">
                      <p class="mb-0">{{ item.tel }}</p>
                    </td>
                    <td class="align-middle text-center text-xs">
                      <span
                        class="badge badge-sm"
                        :class="
                          item.state === '승인'
                            ? 'bg-gradient-success'
                            : 'bg-gradient-danger'
                        "
                        >{{ item.state }}</span
                      >
                    </td>
                    <td class="align-middle text-center">
                      <a
                        href="#"
                        @click.prevent="openEditModal(item)"
                        class="text-secondary font-weight-bold text-xs"
                      >
                        <i class="fas fa-external-link-alt"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <div style="width: 100px"></div>
          <main-pagination
            :totalCount="totalCount"
            :limit="10"
            :currentPage="currentPage"
            @page-change="handlePageChange"
          />
          <button
            class="btn btn-outline-info mb-0 px-4"
            @click="approveSelected"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isModalOpen" class="custom-modal-overlay">
    <div class="custom-modal-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">기관관리자 정보 수정</h5>
        <button class="btn btn-link text-dark p-0 m-0" @click="closeEditModal">
          <i class="fas fa-times fs-5"></i>
        </button>
      </div>

      <div class="mb-3">
        <label class="form-label text-sm">아이디 (수정불가)</label>
        <input
          type="text"
          class="form-control"
          v-model="editForm.id"
          disabled
        />
      </div>
      <div class="mb-3">
        <label class="form-label text-sm">이름</label>
        <input type="text" class="form-control" v-model="editForm.name" />
      </div>
      <div class="mb-4">
        <label class="form-label text-sm">연락처</label>
        <input type="text" class="form-control" v-model="editForm.tel" />
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-secondary mb-0" @click="closeEditModal">
          취소
        </button>
        <button class="btn btn-primary mb-0" @click="submitEdit">
          저장하기
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050; /* 사이드바나 헤더보다 위에 뜨도록 설정 */
}
.custom-modal-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
