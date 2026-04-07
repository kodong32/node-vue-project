<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// 공통 컴포넌트 임포트 (경로 확인 필요)
import AdminHeader from "./adminPageHeader.vue";
import MainPagination from "@/components/MainPagination.vue";

const router = useRouter();

// 상태 변수
const institutionList = ref([]);
const searchKeyword = ref(""); // 검색어
const totalCount = ref(0);
const currentPage = ref(1);
const selectedIds = ref([]);

// 데이터 불러오기 함수
const fetchInstitutionList = async (page = 1) => {
  try {
    const response = await axios.get("/api/admin/institution/list", {
      params: {
        page: page,
        limit: 10,
        name: searchKeyword.value || null, // 기관명 검색어
      },
    });

    institutionList.value = response.data.data || [];
    totalCount.value = response.data.data.length || 0; // 임시 페이징 처리용
    currentPage.value = page;
  } catch (error) {
    console.error("기관 목록 조회 에러:", error);
  }
};

// 검색 실행
const applySearch = () => {
  fetchInstitutionList(1);
};

// 페이지 변경
const handlePageChange = (newPage) => {
  fetchInstitutionList(newPage);
};

// 기관 등록 페이지 이동
const goRegister = () => {
  router.push("/admin/institution/register");
};

// 수정 페이지 이동 (추후 구현)
const goEdit = (id) => {
  router.push(`/admin/institution/edit/${id}`);
};

// 🌟 전체 선택/해제 토글 함수
const toggleSelectAll = (event) => {
  if (event.target.checked) {
    // 전체 선택: 현재 화면에 있는 모든 기관의 ID를 배열에 넣음
    selectedIds.value = institutionList.value.map(
      (item) => item.institution_id,
    );
  } else {
    // 전체 해제
    selectedIds.value = [];
  }
};

// 🌟 선택 삭제 실행 함수
const deleteSelected = async () => {
  if (selectedIds.value.length === 0) {
    return alert("삭제할 기관을 선택해주세요.");
  }

  // 확인 창 띄우기
  if (
    !confirm(
      `선택한 ${selectedIds.value.length}개의 기관을 정말 삭제하시겠습니까?\n(이 작업은 되돌릴 수 없습니다!)`,
    )
  ) {
    return;
  }

  try {
    // DELETE 요청 보낼 때는 data 속성 안에 넣어서 보냅니다.
    await axios.delete("/api/admin/institution", {
      data: { ids: selectedIds.value },
    });

    alert("삭제가 완료되었습니다.");
    selectedIds.value = []; // 체크박스 초기화
    fetchInstitutionList(currentPage.value); // 현재 페이지 목록 다시 불러오기
  } catch (error) {
    console.error("삭제 실패:", error);
    alert("삭제 중 오류가 발생했습니다.");
  }
};

// 🌟 전화번호에 하이픈(-)을 자동으로 예쁘게 넣어주는 함수
const formatPhoneNumber = (number) => {
  if (!number) return "-";

  const cleaned = number.replace(/\D/g, ""); // 숫자만 추출

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 10) {
    if (cleaned.startsWith("02")) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    } else {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
  } else if (cleaned.length === 9) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  return number; // 길이에 맞지 않으면 원본 그대로 출력
};

onMounted(() => {
  fetchInstitutionList(1);
});
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
            <h6 class="mb-0">기관 정보</h6>
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

          <div class="card-body px-0 pt-0 pb-2">
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
                      기관명
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      주소
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      대표번호
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      이메일
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      가입일
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      운영여부
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      수정
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="institutionList.length === 0">
                    <td
                      colspan="9"
                      class="text-center py-4 text-secondary text-sm"
                    >
                      등록된 기관이 없습니다.
                    </td>
                  </tr>

                  <tr
                    v-for="(item, index) in institutionList"
                    :key="item.institution_id"
                  >
                    <td class="align-middle text-center">
                      <div class="form-check d-flex justify-content-center">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :id="'check-' + item.institution_id"
                          :value="item.institution_id"
                          v-model="selectedIds"
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
                      <p class="mb-0">{{ item.address }}</p>
                    </td>
                    <td class="align-middle text-center text-xs">
                      <p class="mb-0">{{ formatPhoneNumber(item.tel) }}</p>
                    </td>
                    <td
                      class="align-middle text-center text-xs text-primary text-decoration-underline"
                    >
                      {{ item.email }}
                    </td>
                    <td class="align-middle text-center text-secondary text-xs">
                      {{ item.join_date }}
                    </td>
                    <td class="align-middle text-center text-xs">
                      <span
                        class="badge badge-sm"
                        :class="{
                          'bg-gradient-success': item.state === 'b001',
                          'bg-gradient-secondary': item.state === 'b002',
                          'bg-gradient-danger': item.state === 'b003',
                        }"
                      >
                        {{
                          item.state === "b001"
                            ? "운영"
                            : item.state === "b002"
                              ? "휴업"
                              : "폐업"
                        }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <a
                        href="#"
                        class="text-secondary font-weight-bold text-xs"
                        @click.prevent="goEdit(item.institution_id)"
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

          <button class="btn btn-outline-danger mb-0" @click="goRegister">
            기관등록
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
