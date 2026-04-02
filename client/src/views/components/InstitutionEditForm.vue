<script setup>
import { reactive, watch } from "vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["save", "cancel", "home"]);

const form = reactive({
  institution_id: "",
  institution_name: "",
  institution_tel: "",
  institution_zipCode: "",
  institution_address: "",
  institution_email: "",
  state: "",
  join_date: "",
});

const display = reactive({
  stateText: "",
  joinDateText: "",
});

const getStateText = (state) => {
  if (state === "b001") return "운영중";
  if (state === "b002") return "폐업";
  if (state === "b003") return "휴무";
  return state || "-";
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

watch(
  () => props.data,
  (newVal) => {
    form.institution_id = newVal?.institution_id || "";
    form.institution_name = newVal?.institution_name || "";
    form.institution_tel = newVal?.institution_tel || "";
    form.institution_zipCode = newVal?.institution_zipCode || "";
    form.institution_address = newVal?.institution_address || "";
    form.institution_email = newVal?.institution_email || "";
    form.state = newVal?.state || "";
    form.join_date = newVal?.join_date || "";

    display.stateText = getStateText(newVal?.state);
    display.joinDateText = formatDate(newVal?.join_date);
  },
  { immediate: true, deep: true }
);

const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      form.institution_zipCode = data.zonecode;
      form.institution_address = data.roadAddress;
    },
  }).open();
};

const onSave = () => {
  emit("save", { ...form });
};
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="mb-4">기관 정보 수정</h5>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-control-label">기관명</label>
          <argon-input type="text" v-model="form.institution_name" />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">기관 연락처</label>
          <argon-input type="text" v-model="form.institution_tel" />
        </div>

        <!-- 우편번호 + 주소검색 -->
        <div class="col-md-6 mb-3">
          <label class="form-control-label">우편번호</label>

          <div class="d-flex gap-2 align-items-stretch">
            <!-- 표시용 -->
            <div class="form-control bg-light" style="max-width: 150px;">
              {{ form.institution_zipCode || "-" }}
            </div>

            <!-- 버튼 -->
            <argon-button
              class="mb-0 px-3 d-flex align-items-center justify-content-center"
              style="white-space: nowrap;"
              @click="openPostcode"
            >
              주소 검색
            </argon-button>
          </div>
        </div>

        <!-- 주소 표시 -->
        <div class="col-md-12 mb-3">
          <label class="form-control-label">주소</label>
          <div class="form-control bg-light">
            {{ form.institution_address || "-" }}
          </div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-control-label">이메일</label>
          <argon-input type="text" v-model="form.institution_email" />
        </div>

        <!-- 상태 -->
        <div class="col-md-6 mb-3">
          <label class="form-control-label">상태</label>
          <div class="form-control bg-light">
            {{ display.stateText }}
          </div>
        </div>

        <!-- 가입일 -->
        <div class="col-md-6 mb-4">
          <label class="form-control-label">가입일</label>
          <div class="form-control bg-light">
            {{ display.joinDateText }}
          </div>
        </div>
      </div>

      <div class="d-flex gap-2">
        <ArgonButton color="success" class="w-100 mb-0" @click="onSave">
          수정
        </ArgonButton>

        <ArgonButton color="secondary" class="w-100 mb-0" @click="$emit('cancel')">
          취소
        </ArgonButton>
      </div>
    </div>
  </div>
</template>