<template>
  <RoleHeader />
  <div class="py-4 container-fluid" style="position: relative; z-index: 10">
    <div class="row">
      <div class="col-12">
        <div class="row mb-3">
          <div class="col-5">
            <select class="form-select" v-model="mainManager">
              <option value="">담당자 선택(정)</option>
              <option
                v-for="manager in managers"
                :key="manager.I_UserId"
                :value="manager.I_UserId"
              >
                {{ manager.name }} ({{ manager.I_UserId }})
              </option>
            </select>
          </div>
          <div class="col-5">
            <select class="form-select" v-model="subManager">
              <option value="">담당자 선택(부)</option>
              <option
                v-for="manager in managers"
                :key="manager.I_UserId"
                :value="manager.I_UserId"
              >
                {{ manager.name }} ({{ manager.I_UserId }})
              </option>
            </select>
          </div>
          <div class="col-2">
            <button class="btn btn-primary" @click="saveAssignment">
              배정 저장
            </button>
          </div>
        </div>
        <SelectCard
          :sections="allSections"
          :answers="answerData"
          :userName="targetUserName"
          :regDate="targetRegDate"
          :extraInputs="extraInputs"
          :extraRequest="extraRequest"
          :managers="managers"
          v-model:selectedManager="selectedManager"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import RoleHeader from "./components/RoleHeader.vue";
import SelectCard from "./components/surveyManagerCard.vue";
// import { useRoute } from "vue-router";

// const route = useRoute();

const allSections = ref([]);
const answerData = ref([]);
const extraInputs = ref({});
const extraRequest = ref("");
const targetUserName = ref("");
const targetRegDate = ref("");
const managers = ref([]);
const mainManager = ref("");
const subManager = ref("");
const supportId = ref("");

const callme = async () => {
  const result = await fetch(`/api/user/managerlist2`, {
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());
  managers.value = result.data || [];
};

onMounted(async () => {
  await callme();
  // try {
  //   const J_ID = route.params.id;
  //   let G_USER = route.query.userId || "";
  //   // 1. 조사지 조회 시도
  //   try {
  //     const surveyRes = await fetch(
  //       `http://localhost:3000/survey/user/${J_ID}`,
  //     );
  //     if (surveyRes.ok) {
  //       const rawQuestions = await surveyRes.json();
  //       if (rawQuestions && rawQuestions.length > 0) {
  //         G_USER = rawQuestions[0].G_UserId || G_USER;
  //         console.log("2. 조사지 로드 성공! G_USER:", G_USER);
  //         // (기존 UI 세팅 로직은 잠시 생략하시거나 그대로 두셔도 됩니다)
  //       }
  //     } else {
  //       console.warn("2. 조사지 API 실패 (404 등). G_USER를 못 찾았습니다.");
  //     }
  //   } catch (e) {
  //     console.error("조사지 API 에러:", e);
  //   }
  //   console.log(managerRes);
  //   const managerData = await managerRes.json();
  //   // 2. 기관 ID 조회
  //   if (G_USER) {
  //     const supportRes = await fetch(
  //       `http://localhost:3000/user/support/by-jid/${G_USER}`,
  //     );
  //     const supportData = await supportRes.json();
  //     console.log("3. 지원 정보 데이터:", supportData);
  //     if (supportData && supportData.length > 0) {
  //       supportId.value = supportData[0].support_id;
  //       const institutionId = supportData[0].institution_id;
  //       console.log("4. 추출된 기관 ID:", institutionId);
  //       // 3. 담당자 목록 조회 (수정하신 라우터 주소 적용)
  //       // 백엔드 라우터 주소가 맞는지 이 부분의 URL을 꼭 다시 확인해주세요!
  //       console.log("5. 담당자 API 응답 원본:", managerData);
  //       // 백엔드에서 { status: "Success", data: [...] } 형태로 주므로 아래처럼 할당
  //       managers.value = Array.isArray(managerData)
  //         ? managerData
  //         : managerData.data || [];
  //       console.log("6. 🎉 최종 세팅된 매니저 목록:", managers.value);
  //     } else {
  //       console.error(
  //         "❌ 기관 ID를 찾을 수 없습니다. (supportData가 비어있음)",
  //       );
  //     }
  //   } else {
  //     console.error(
  //       "❌ G_USER 값이 없어서 담당자 조회 로직이 실행되지 않았습니다!",
  //     );
  //   }
  // } catch (err) {
  //   console.error("전체 흐름 에러:", err);
  // }
});

const saveAssignment = async () => {
  // 정/부 담당자 둘 다 선택했는지 확인
  if (!mainManager.value || !subManager.value) {
    alert("정/부 담당자를 모두 선택하세요.");
    return;
  }

  // 같은 사람 선택 방지
  if (mainManager.value === subManager.value) {
    alert("정/부 담당자는 다르게 선택하세요.");
    return;
  }

  // 배정 payload
  const payload = {
    support_id: supportId.value,
    I_UserId1: mainManager.value,
    I_UserId2: subManager.value,
  };

  try {
    // 담당자 배정 저장
    const response = await fetch("http://localhost:3000/user/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("담당자 배정이 완료되었습니다.");
    }
  } catch (err) {
    console.error("저장 실패:", err);
  }
};
</script>
