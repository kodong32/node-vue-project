<!-- PriorityRequest.vue -->
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

// 상태 관리 변수들
const candidateInfo = ref(null); // 백엔드에서 받아올 정보
const selectedPriority = ref(""); // 선택한 우선순위 코드 (f001, f002, f003)
const reasonText = ref(""); // 입력한 사유

// 화면 켜지자마자 데이터 가져오기
onMounted(async () => {
  const surveyId = route.params.id; // 나중에 라우터에 :id 연결해야 함!

  // 🚨 지금은 테스트용으로 하드코딩된 ID(SUV0017)를 넣어서 화면을 확인하자!
  // 실제 연결 시에는: `http://localhost:3000/priority/candidate/${surveyId}` 로 변경
  try {
    const response = await axios.get(`http://localhost:3000/priority/SUV0018`);
    candidateInfo.value = response.data;
  } catch (error) {
    console.error("정보 로딩 실패:", error);
  }
});

// 승인 요청 버튼 클릭 시 실행할 함수 (뼈대만)
const submitRequest = () => {
  if (!selectedPriority.value) {
    alert("우선순위(계획/중점/긴급)를 선택해주세요!");
    return;
  }
  if (!reasonText.value.trim()) {
    alert("선택 사유를 입력해주세요!");
    return;
  }

  console.log("서버로 보낼 데이터:", {
    priority: selectedPriority.value,
    reason: reasonText.value,
  });
  alert("콘솔창을 확인해보세요! 이제 이걸 백엔드로 쏘는 API만 만들면 됩니다.");
};
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12 col-lg-8 mx-auto">
        <div class="card mb-4">
          <div class="card-header pb-0">
            <h6 class="mb-0">지원자 정보</h6>
          </div>
          <div class="card-body">
            <div class="row" v-if="candidateInfo">
              <div class="col-md-6">
                <p class="text-sm mb-1">
                  <strong>지원자:</strong> {{ candidateInfo.supportName }}
                </p>
                <p class="text-sm mb-1">
                  <strong>성별:</strong> {{ candidateInfo.genderCode }}
                </p>
              </div>
              <div class="col-md-6">
                <p class="text-sm mb-1">
                  <strong>보호자:</strong> {{ candidateInfo.generalName }}
                </p>
                <p class="text-sm mb-1">
                  <strong>생년월일:</strong> {{ candidateInfo.birthDate }}
                </p>
                <p class="text-sm mb-0">
                  <strong>장애유형:</strong>
                  {{ candidateInfo.disMajorName || "미등록" }}
                </p>
              </div>
            </div>
            <div v-else class="text-center py-3">
              <span
                class="spinner-border spinner-border-sm text-primary"
                role="status"
              ></span>
              데이터를 불러오는 중입니다...
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header pb-0">
            <h6 class="mb-0">
              {{ candidateInfo?.supportName || "지원자" }} 님의
              대기단계(우선순위) 설정
            </h6>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-center gap-3 mb-4 mt-3">
              <button
                class="btn btn-outline-info px-5"
                :class="{ active: selectedPriority === 'f001' }"
                @click="selectedPriority = 'f001'"
              >
                계획
              </button>
              <button
                class="btn btn-outline-success px-5"
                :class="{ active: selectedPriority === 'f002' }"
                @click="selectedPriority = 'f002'"
              >
                중점
              </button>
              <button
                class="btn btn-outline-danger px-5"
                :class="{ active: selectedPriority === 'f003' }"
                @click="selectedPriority = 'f003'"
              >
                긴급
              </button>
            </div>

            <div class="form-group mb-4">
              <label for="priorityReason" class="form-control-label"
                >우선순위 선택 사유 (필수)</label
              >
              <textarea
                class="form-control"
                id="priorityReason"
                rows="5"
                v-model="reasonText"
                placeholder="해당 우선순위를 선택한 사유를 상세히 적어주세요."
              ></textarea>
            </div>

            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-primary mb-0" @click="submitRequest">
                승인 요청
              </button>
              <button
                class="btn btn-secondary mb-0"
                @click="$router.push('/manager')"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 선택된 버튼을 예쁘게 칠해주기 위한 간단한 스타일 */
.btn-outline-info.active {
  background-color: #11cdef;
  color: white;
}
.btn-outline-success.active {
  background-color: #2dce89;
  color: white;
}
.btn-outline-danger.active {
  background-color: #f5365c;
  color: white;
}
</style>
