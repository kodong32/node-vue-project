<script setup>
import ArgonButton from "@/components/ArgonButton.vue";

defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
  isEditOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["edit"]);
</script>

<template>
  <div class="guardian-card card h-100 rounded-0 shadow-none border-0">
    <div class="card-header border-bottom bg-white">
      <h5 class="mb-1 fw-bold">보호자</h5>
      <p class="mb-0 text-sm text-secondary">
        {{ info.name ? `${info.name}님의 정보` : "보호자 기본 정보" }}
      </p>
    </div>

    <div class="card-body p-0 d-flex flex-column">
      <div class="info-row">
        <div class="label">아이디</div>
        <div class="value">{{ info.userId || "-" }}</div>
      </div>

      <div class="info-row">
        <div class="label">연락처</div>
        <div class="value">{{ info.tel || "-" }}</div>
      </div>

      <div class="info-row">
        <div class="label">이메일</div>
        <div class="value text-break">{{ info.email || "-" }}</div>
      </div>

      <div class="info-row">
        <div class="label">주소</div>
        <div class="value text-break">{{ info.address || "-" }}</div>
      </div>

      <div class="info-row border-bottom-0">
        <div class="label">등록된 기관명</div>
        <div class="value text-break">{{ info.institution || "-" }}</div>
      </div>

      <div class="mt-auto p-3 d-grid">
        <ArgonButton color="secondary" class="mb-0" @click="$emit('edit')">
          {{ isEditOpen ? "닫기" : "내 정보 수정" }}
        </ArgonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guardian-card {
  min-height: 640px;
  border-right: 1px solid #dcdfe6 !important;
}

.info-row {
  min-height: 69px;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.label {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 6px;
}

.value {
  font-size: 15px;
  font-weight: 600;
  color: #344767;
}

@media (max-width: 991px) {
  .guardian-card {
    min-height: auto;
    border-right: none !important;
    border-bottom: 1px solid #dcdfe6 !important;
  }
}
</style>