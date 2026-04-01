<!-- D:\node-vue-project\client\src\views\components\ApprovalResultCardList.vue -->
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  resultList: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["onApprove", "onRejectClick"]);
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
            <div class="d-flex gap-4">
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
                <span class="text-secondary text-xs">지원자</span
                ><span class="text-dark font-weight-bold ms-2">{{
                  item.supportName
                }}</span>
              </div>
            </div>
            <div>
              <span class="text-secondary text-xs">장애유형</span>
              <span class="text-dark text-sm ms-2">{{
                item.disabilityType || "미지정"
              }}</span>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-md-6">
              <span class="text-secondary text-xs">지원 시작일</span>
              <p class="text-sm font-weight-bold mb-0">
                {{ item.support_startDate }}
              </p>
            </div>
            <div class="col-md-6">
              <span class="text-secondary text-xs">지원 종료일</span>
              <p class="text-sm font-weight-bold mb-0">
                {{ item.supprot_endDate }}
              </p>
            </div>
          </div>

          <div class="p-3 bg-light border-radius-md mb-4">
            <h6 class="text-secondary text-sm mb-2">
              <i class="fas fa-file-alt me-1"></i>지원계획
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
              {{ item.resultTitle || "작성된 제목이 없습니다." }}
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
              {{ item.resultContent || "작성된 내용이 없습니다." }}
            </div>
          </div>

          <div
            class="d-flex justify-content-between align-items-end mt-4 pt-3 border-top"
          >
            <div>
              <span class="text-dark text-sm font-weight-bold me-2"
                ><i class="fas fa-paperclip me-1"></i>첨부파일</span
              >
              <a
                v-if="item.file1"
                :href="item.file1"
                class="text-primary text-sm me-3"
                target="_blank"
                >{{ item.file1 }}</a
              >
              <a
                v-if="item.file2"
                :href="item.file2"
                class="text-primary text-sm"
                target="_blank"
                >{{ item.file2 }}</a
              >
              <span
                v-if="!item.file1 && !item.file2"
                class="text-secondary text-sm"
                >첨부파일 없음</span
              >
            </div>

            <div class="d-flex align-items-center gap-2">
              <button
                class="btn btn-primary btn-sm mb-0 px-4"
                @click="emit('onApprove', item.result_report)"
              >
                승인
              </button>
              <button
                class="btn btn-outline-danger btn-sm mb-0 px-4"
                @click="emit('onRejectClick', item.result_report)"
              >
                반려
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="props.resultList.length === 0" class="text-center py-5">
        <p class="text-secondary mb-0">검토 대기 중인 지원결과서가 없습니다.</p>
      </div>
    </div>
  </div>
</template>
