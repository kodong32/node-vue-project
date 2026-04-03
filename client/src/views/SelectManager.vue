<template>
  <RoleHeader />
  <div class="py-4 container-fluid" style="position: relative; z-index: 10">
    <div class="row">
      <div class="col-12">
        <div class="row mb-3 justify-content-center align-items-center g-2">
          <div class="col-4">
            <select class="form-select" v-model="mainManager">
              <option value="">담당자 선택(정)</option>
              <option
                v-for="manager in managers"
                :key="manager.I_UserId"
                :value="manager.I_UserId"
              >
                {{ manager.name }}
              </option>
            </select>
          </div>

          <div class="col-4">
            <select class="form-select" v-model="subManager">
              <option value="">담당자 선택(부)</option>
              <option
                v-for="manager in managers"
                :key="manager.I_UserId"
                :value="manager.I_UserId"
              >
                {{ manager.name }}
              </option>
            </select>
          </div>

          <div class="col-1">
            <button class="btn btn-primary w-100 mb-0" @click="saveAssignment">
              배정 저장
            </button>
          </div>
        </div>

        <surveySelect @loaded="handleSurveyLoaded" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import RoleHeader from "./components/RoleHeader.vue";
import surveySelect from "./components/surveySelectCard.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const managers = ref([]);
const mainManager = ref("");
const subManager = ref("");
const supportId = ref("");

// 담당자 목록 조회
const callme = async () => {
  const result = await fetch(`/api/user/managerlist2`, {
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());

  managers.value = result.data || [];
};

onMounted(async () => {
  await callme();
});

// surveySelect 에서 전달받음
const handleSurveyLoaded = (data) => {
  console.log("부모에서 받은 survey 정보:", data);
  supportId.value = data.supportId;
};

const saveAssignment = async () => {
  if (!mainManager.value || !subManager.value) {
    alert("정/부 담당자를 모두 선택하세요.");
    return;
  }

  if (mainManager.value === subManager.value) {
    alert("정/부 담당자는 다르게 선택하세요.");
    return;
  }

  const payload = {
    support_id: supportId.value,
    I_UserId1: mainManager.value,
    I_UserId2: subManager.value,
  };
  try {
    const response = await fetch("/api/user/assign", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response) {
      alert("담당자 배정이 완료되었습니다.");
      router.push("/general");
    }
  } catch (err) {
    console.error("저장 실패:", err);
  }
};
</script>
