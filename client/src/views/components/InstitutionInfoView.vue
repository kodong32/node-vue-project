<script setup>
defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
});

const getStateText = (state) => {
  if (state === "b001") return "운영중";
  if (state === "b002") return "폐업";
  if (state === "b003") return "휴무";
  return state || "-";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return String(dateStr).slice(0, 10);
};
</script>

<template>
  <div class="section-card card h-100 rounded-0 shadow-none border-0">
    <div class="card-header border-bottom bg-white">
      <h4 class="mb-0 fw-bold">기관 정보</h4>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-12 mb-3">
          <label class="form-control-label">기관 ID</label>
          <div class="readonly-box">{{ info.institution_id || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">기관명</label>
          <div class="readonly-box">{{ info.institution_name || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">기관 연락처</label>
          <div class="readonly-box">{{ info.institution_tel || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">기관 이메일</label>
          <div class="readonly-box">{{ info.institution_email || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">우편번호</label>
          <div class="readonly-box">{{ info.institution_zipCode || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">주소</label>
          <div class="readonly-box">{{ info.institution_address || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">상태</label>
          <div class="readonly-box">{{ getStateText(info.state) }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">가입일</label>
          <div class="readonly-box">{{ formatDate(info.join_date) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-card {
  min-height: 640px;
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
  }
}
</style>