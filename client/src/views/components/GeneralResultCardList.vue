<!-- D:\node-vue-project\client\src\views\components\GeneralResultCardList.vue -->
<script setup>
import { defineProps } from "vue";

const props = defineProps({
  resultList: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// 상태에 따라 뱃지 색상을 다르게 주기 위한 함수
const getBadgeClass = (stateName) => {
  if (stateName === "승인 완료") return "bg-success";
  if (stateName === "반려") return "bg-danger";
  return "bg-warning"; // 승인요청중 (대기)
};

const downloadFile = (fileName) => {
  if (!fileName) return;

  const url = `/api/result/plan/download/${encodeURIComponent(fileName)}`;

  window.location.href = url;
};
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div
        v-for="(item, index) in props.resultList"
        :key="item.result_report || index"
        class="card mb-4 shadow-sm border-0"
      >
        <div class="card-body p-4">
          <div
            class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom flex-wrap"
          >
            <div class="d-flex gap-4 align-items-center">
              <span class="badge" :class="getBadgeClass(item.stateName)">{{
                item.stateName
              }}</span>
              <div>
                <span class="text-secondary text-xs">작성일</span
                ><span class="text-dark font-weight-bold ms-2">{{
                  item.created_at
                }}</span>
              </div>
              <div>
                <span class="text-secondary text-xs">담당자</span
                ><span class="text-dark font-weight-bold ms-2">{{
                  item.managerName
                }}</span>
              </div>
              <div>
                <span class="text-secondary text-xs">보호자</span
                ><span class="text-dark font-weight-bold ms-2">{{
                  item.guardianName
                }}</span>
              </div>
              <div>
                <span class="text-secondary text-xs">지원대상자</span
                ><span class="text-dark font-weight-bold ms-2">{{
                  item.supportName
                }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="item.stateName === '반려'"
            class="p-3 mb-4 border border-radius-md"
            style="background-color: #fff0f0; border-color: #ffc6c6 !important"
          >
            <h6 class="text-danger text-sm mb-2 font-weight-bold">
              <i class="fas fa-exclamation-circle me-1"></i>반려 사유
            </h6>
            <p class="text-sm text-dark mb-0">
              {{ item.reject_reason || "사유 없음" }}
            </p>
          </div>

          <div class="p-3 bg-light border-radius-md mb-4">
            <h6 class="text-secondary text-sm mb-2">
              <i class="fas fa-file-alt me-1"></i>기존 지원계획
            </h6>
            <div class="mb-2">
              <span class="text-xs text-secondary">계획 목표:</span>
              <p class="text-sm text-dark mb-0">{{ item.planPurpose }}</p>
            </div>
            <div>
              <span class="text-xs text-secondary">계획 내용:</span>
              <p class="text-sm text-dark mb-0">{{ item.planContent }}</p>
            </div>
          </div>

          <div class="mb-3">
            <h6 class="text-dark text-sm mb-1 text-primary">
              <i class="fas fa-check-circle me-1"></i>지원결과 제목
            </h6>
            <div class="p-3 border border-radius-md text-sm text-dark">
              {{ item.resultTitle }}
            </div>
          </div>
          <div class="mb-3">
            <h6 class="text-dark text-sm mb-1 text-primary">
              <i class="fas fa-check-circle me-1"></i>지원결과 내용
            </h6>
            <div
              class="p-3 border border-radius-md text-sm text-dark"
              style="min-height: 80px"
            >
              {{ item.resultContent }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-top">
            <span class="text-dark text-sm font-weight-bold me-2">
              <i class="fas fa-paperclip me-1"></i>첨부파일
            </span>

            <a
              v-if="item.file1"
              href="#"
              @click.prevent="downloadFile(item.file1)"
              class="text-primary text-sm me-3"
            >
              {{ item.file1 }}
            </a>

            <a
              v-if="item.file2"
              href="#"
              @click.prevent="downloadFile(item.file2)"
              class="text-primary text-sm"
            >
              {{ item.file2 }}
            </a>

            <span
              v-if="!item.file1 && !item.file2"
              class="text-secondary text-sm"
            >
              첨부파일 없음
            </span>
          </div>
        </div>
      </div>

      <div v-if="props.resultList.length === 0" class="text-center py-5">
        <p class="text-secondary mb-0">조회된 지원결과서가 없습니다.</p>
      </div>
    </div>
  </div>
</template>
