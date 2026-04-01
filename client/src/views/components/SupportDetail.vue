<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const majorLabel = ref("-");
const middleLabel = ref("-");

const bornText = computed(() => {
  if (!props.data?.born) return "-";
  return String(props.data.born).slice(0, 10);
});

const genderText = computed(() => {
  if (props.data?.gender === "c001") return "남";
  if (props.data?.gender === "c002") return "여";
  return props.data?.gender || "-";
});

const relationText = computed(() => {
  if (props.data?.relation === "d001") return "자녀";
  if (props.data?.relation === "d002") return "부모";
  if (props.data?.relation === "d003") return "요양보호사";
  return props.data?.relation || "-";
});

const guardianApprovalText = computed(() => {
  if (props.data?.guardian_approval === "G001") return "승인대기";
  if (props.data?.guardian_approval === "G002") return "승인완료";
  if (props.data?.guardian_approval === "G003") return "반려";
  return props.data?.guardian_approval || "-";
});

const parseCodes = (value) => {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");
};

const loadDisabilityNames = async () => {
  try {
    const majorCodes = parseCodes(props.data?.major);
    const middleCodes = parseCodes(props.data?.middle);

    // 대분류
    if (majorCodes.length > 0) {
      const majorResult = await fetch("/api/dis/disList", {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());

      const majorList = Array.isArray(majorResult) ? majorResult : [];
      const majorNames = majorCodes.map((code) => {
        const found = majorList.find((item) => item.b_Code === code);
        return found ? found.description : code;
      });

      majorLabel.value = majorNames.length > 0 ? majorNames.join(", ") : "-";
    } else {
      majorLabel.value = "-";
    }

    // 중분류
    if (middleCodes.length > 0 && majorCodes.length > 0) {
      const query = majorCodes
        .map((code) => `bCodes=${encodeURIComponent(code)}`)
        .join("&");

      const middleResult = await fetch(`/api/dis/disMidList?${query}`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());

      const middleList = Array.isArray(middleResult) ? middleResult : [];
      const middleNames = middleCodes.map((code) => {
        const found = middleList.find((item) => item.j_Code === code);
        return found ? found.description : code;
      });

      middleLabel.value =
        middleNames.length > 0 ? middleNames.join(", ") : "-";
    } else {
      middleLabel.value = "-";
    }
  } catch (err) {
    console.log("loadDisabilityNames error :", err);
    majorLabel.value = props.data?.major || "-";
    middleLabel.value = props.data?.middle || "-";
  }
};

watch(
  () => props.data,
  async () => {
    await loadDisabilityNames();
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="detail-card card h-100 rounded-0 shadow-none border-0">
    <div class="card-header border-bottom bg-white">
      <h4 class="mb-0 fw-bold">
        {{
          data.support_name
            ? `${data.support_name}님 정보`
            : "지원 대상자 정보"
        }}
      </h4>
    </div>

    <div class="card-body">
      <h6 class="section-title">지원 대상자 정보</h6>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-control-label">이름</label>
          <div class="readonly-box">{{ data.support_name || "-" }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">생년월일</label>
          <div class="readonly-box">{{ bornText }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">성별</label>
          <div class="readonly-box">{{ genderText }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">관계</label>
          <div class="readonly-box">{{ relationText }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">우편번호</label>
          <div class="readonly-box">{{ data.support_zipCode || "-" }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">담당구분</label>
          <div class="readonly-box">{{ data.chargeType || "-" }}</div>
        </div>

        <div class="col-md-12 mb-3">
          <label class="form-control-label">주소</label>
          <div class="readonly-box">{{ data.support_address || "-" }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">대분류</label>
          <div class="readonly-box">{{ majorLabel }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">중분류</label>
          <div class="readonly-box">{{ middleLabel }}</div>
        </div>

        <div class="col-md-12 mb-3">
          <label class="form-control-label">기타</label>
          <div class="readonly-box">{{ data.sub || "-" }}</div>
        </div>
      </div>

      <hr class="horizontal dark my-4" />

      <h6 class="section-title">보호자 정보</h6>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-control-label">이름</label>
          <div class="readonly-box">{{ data.guardian_name || "-" }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">아이디</label>
          <div class="readonly-box">{{ data.guardian_id || "-" }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">연락처</label>
          <div class="readonly-box">{{ data.guardian_tel || "-" }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">이메일</label>
          <div class="readonly-box">{{ data.guardian_email || "-" }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">우편번호</label>
          <div class="readonly-box">{{ data.guardian_zipCode || "-" }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">승인상태</label>
          <div class="readonly-box">{{ guardianApprovalText }}</div>
        </div>

        <div class="col-md-12 mb-3">
          <label class="form-control-label">주소</label>
          <div class="readonly-box">{{ data.guardian_address || "-" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-card {
  min-height: 640px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #344767;
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
  word-break: break-all;
  line-height: 1.4;
}

@media (max-width: 991px) {
  .detail-card {
    min-height: auto;
  }
}
</style>