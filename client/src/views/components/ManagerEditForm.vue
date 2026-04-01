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

const emit = defineEmits(["save", "change-password", "cancel"]);

const form = reactive({
  userId: "",
  name: "",
  tel: "",
  email: "",
  institution: "",
  institution_id: "",
  joinDate: "",
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
});

watch(
  () => props.data,
  (newVal) => {
    form.userId = newVal?.userId || "";
    form.name = newVal?.name || "";
    form.tel = newVal?.tel || "";
    form.email = newVal?.email || "";
    form.institution = newVal?.institution || "";
    form.institution_id = newVal?.institution_id || "";
    form.joinDate = newVal?.joinDate || "";
    form.currentPassword = "";
    form.newPassword = "";
    form.newPasswordConfirm = "";
  },
  { immediate: true, deep: true }
);

const onSave = () => {
  emit("save", {
    name: form.name,
    tel: form.tel,
    email: form.email,
    institution_id: form.institution_id,
  });
};

const onChangePassword = () => {
  if (!form.currentPassword.trim()) {
    alert("현재 비밀번호를 입력하세요.");
    return;
  }

  if (!form.newPassword.trim()) {
    alert("새 비밀번호를 입력하세요.");
    return;
  }

  if (form.newPassword !== form.newPasswordConfirm) {
    alert("새 비밀번호 확인이 일치하지 않습니다.");
    return;
  }

  emit("change-password", {
    currentPassword: form.currentPassword,
    newPassword: form.newPassword,
    newPasswordConfirm: form.newPasswordConfirm,
  });

  form.currentPassword = "";
  form.newPassword = "";
  form.newPasswordConfirm = "";
};
</script>

<template>
  <div class="section-card card h-100 rounded-0 shadow-none border-0">
    <div class="card-header border-bottom bg-white">
      <h4 class="mb-0 fw-bold">담당자 정보 수정</h4>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-12 mb-3">
          <label class="form-control-label">아이디</label>
          <div class="readonly-box">{{ form.userId || "-" }}</div>
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">이름</label>
          <ArgonInput type="text" v-model="form.name" />
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">연락처</label>
          <ArgonInput type="text" v-model="form.tel" />
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">기관명</label>
          <div class="readonly-box">{{ form.institution || "-" }}</div>
        </div>

        <div class="col-12 mt-3 mb-3">
          <label class="form-control-label">현재 비밀번호</label>
          <ArgonInput type="password" v-model="form.currentPassword" />
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">새 비밀번호</label>
          <ArgonInput type="password" v-model="form.newPassword" />
        </div>

        <div class="col-12 mb-3">
          <label class="form-control-label">새 비밀번호 확인</label>
          <ArgonInput type="password" v-model="form.newPasswordConfirm" />
        </div>

        <div class="col-12 mt-2">
          <ArgonButton color="dark" class="mb-0" @click="onChangePassword">
            비밀번호 변경
          </ArgonButton>
        </div>

        <div class="col-md-6 mt-4">
          <ArgonButton color="success" class="w-100 mb-0" @click="onSave">
            저장
          </ArgonButton>
        </div>

        <div class="col-md-6 mt-4">
          <ArgonButton color="secondary" class="w-100 mb-0" @click="emit('cancel')">
            취소
          </ArgonButton>
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