<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  planList: {
    type: Array,
    required: true,
    default: () => [],
  },
  userRole: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["edit", "delete"]);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStateText = (state) => {
  switch (state) {
    case "g001":
      return "승인";
    case "g002":
      return "반려";
    case "g003":
      return "미정";
    default:
      return state || "미정";
  }
};

const getStateBtnClass = (state) => {
  switch (state) {
    case "g001":
      return "btn-success";
    case "g002":
      return "btn-warning";
    case "g003":
      return "btn-secondary";
    default:
      return "btn-secondary";
  }
};

const getBadgeClass = (state) => {
  switch (state) {
    case "g001":
      return "bg-success";
    case "g002":
      return "bg-warning";
    case "g003":
      return "bg-secondary";
    default:
      return "bg-secondary";
  }
};

const getFileUrl = (fileName) => {
  if (!fileName) return "";
  return `/uploads/supportPlan/${fileName}`;
};

const onEdit = (item) => {
  emit("edit", item);
};

const onDelete = (item) => {
  emit("delete", item.supportPlan_id);
};
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div
        v-for="(item, index) in props.planList"
        :key="item.supportPlan_id || index"
        class="card mb-4 shadow-sm"
      >
        <div class="card-body p-4">
          <div
            class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom"
          >
            <div class="d-flex gap-4 flex-wrap">
              <div>
                <span class="text-secondary text-xs">작성자</span>
                <span class="text-dark font-weight-bold ms-1">
                  {{ item.writer_name || "-" }}
                </span>
              </div>

              <div>
                <span class="text-secondary text-xs">보호자</span>
                <span class="text-dark font-weight-bold ms-1">
                  {{ item.guardian_name || "-" }}
                </span>
              </div>

              <div>
                <span class="text-secondary text-xs">지원대상자</span>
                <span class="text-dark font-weight-bold ms-1">
                  {{ item.support_name || "-" }}
                </span>
              </div>
            </div>

            <div class="d-flex gap-3 align-items-center">
              <div>
                <span class="text-secondary text-xs">계획서번호</span>
                <span class="text-dark text-sm ms-1">
                  {{ item.supportPlan_id || "-" }}
                </span>
              </div>

              <span class="badge" :class="getBadgeClass(item.state)">
                {{ getStateText(item.state) }}
              </span>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <span class="text-secondary text-xs">지원 시작일</span>
              <p class="text-sm font-weight-bold mb-0">
                {{ formatDate(item.support_startDate) }}
              </p>
            </div>

            <div class="col-md-6">
              <span class="text-secondary text-xs">지원 종료일</span>
              <p class="text-sm font-weight-bold mb-0">
                {{ formatDate(item.supprot_endDate) }}
              </p>
            </div>
          </div>

          <div class="mb-3">
            <h6 class="text-dark text-sm mb-1">지원계획 목표</h6>
            <div class="p-3 bg-gray-100 border-radius-md text-sm">
              {{ item.purpose || "작성된 목표가 없습니다." }}
            </div>
          </div>

          <div class="mb-3">
            <h6 class="text-dark text-sm mb-1">지원계획 내용</h6>
            <div
              class="p-3 bg-gray-100 border-radius-md text-sm"
              style="min-height: 80px"
            >
              {{ item.content || "작성된 내용이 없습니다." }}
            </div>
          </div>

          <div v-if="item.reject_reason" class="mb-3">
            <h6 class="text-danger text-sm mb-1">반려 사유</h6>
            <div class="p-3 bg-gray-100 border-radius-md text-sm">
              {{ item.reject_reason }}
            </div>
          </div>

          <div
            class="d-flex justify-content-between align-items-end mt-4 pt-3 border-top flex-wrap gap-3"
          >
            <div>
              <span class="text-dark text-sm font-weight-bold me-2">
                <i class="fas fa-paperclip me-1"></i>첨부파일
              </span>

              <a
                v-if="item.file"
                :href="getFileUrl(item.file)"
                class="text-primary text-sm me-3"
                target="_blank"
              >
                파일 1 다운로드
              </a>

              <a
                v-if="item.file2"
                :href="getFileUrl(item.file2)"
                class="text-primary text-sm"
                target="_blank"
              >
                파일 2 다운로드
              </a>

              <span
                v-if="!item.file && !item.file2"
                class="text-secondary text-sm"
              >
                첨부파일 없음
              </span>
            </div>

            <div class="d-flex align-items-center flex-wrap">
              <span class="text-secondary text-xs me-2">작성일</span>
              <span class="badge bg-light text-dark border me-3">
                {{ formatDate(item.wirte_at) }}
              </span>

              <button
                class="btn btn-sm mb-0 px-4 me-2"
                :class="getStateBtnClass(item.state)"
                type="button"
              >
                {{ getStateText(item.state) }}
              </button>

              <template v-if="item.state === 'g003'">
                <button
                  class="btn btn-sm btn-primary mb-0 px-3 me-2"
                  type="button"
                  @click="onEdit(item)"
                >
                  수정
                </button>

                <button
                  class="btn btn-sm btn-danger mb-0 px-3"
                  type="button"
                  @click="onDelete(item)"
                >
                  삭제
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div v-if="props.planList.length === 0" class="text-center py-5">
        <p class="text-secondary mb-0">조회된 지원계획서가 없습니다.</p>
      </div>
    </div>
  </div>
</template>