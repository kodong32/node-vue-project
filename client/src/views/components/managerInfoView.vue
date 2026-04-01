<script setup>
defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <div class="section-card card h-100 rounded-0 shadow-none border-0">
    <div class="card-header border-bottom bg-white">
      <h4 class="mb-0 fw-bold">기관 담당자 정보</h4>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-12 mb-3">
          <label class="form-control-label">이름</label>
          <div class="readonly-box">{{ info.name || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">아이디</label>
          <div class="readonly-box">{{ info.userId || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">연락처</label>
          <div class="readonly-box">{{ info.tel || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">기관명</label>
          <div class="readonly-box">{{ info.institution || "-" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-card {
  min-height: 640px;
  border-right: 1px solid #dcdfe6 !important;
}

.readonly-box {
  width: 100%;
  min-height: 42px;
  padding: 0.75rem 0.875rem;
  border: 1px solid #d2d6da;
  border-radius: 0.5rem;
  background-color: #f8f9fa;
  color: #344767;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  line-height: 1.4;
  word-break: break-all;
}

@media (max-width: 991px) {
  .section-card {
    min-height: auto;
    border-right: none !important;
    border-bottom: 1px solid #dcdfe6 !important;
  }
}
</style>