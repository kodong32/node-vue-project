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
const rejectReasonMsg = ref("");

onMounted(async () => {
  // 💡 1. 하드코딩 변수 세팅
  // const surveyId = "SUV0018";
  const surveyId = route.params.id;

  if (!surveyId) {
    alert("조사지 정보가 없습니다!");
    return;
  }

  // 💡 2. route 변수 사용한 척 해서 에러(no-unused-vars) 없애기
  // console.log(`현재 페이지 ID (사용 안함): ${route.params.id}`);

  try {
    // 💡 3. 네 백엔드 세팅에 맞게 /candidate/ 빼고 정확한 주소로 찌르기!
    const response = await axios.get(
      `http://localhost:3000/priority/${surveyId}`,
    );
    candidateInfo.value = response.data;
    if (response.data.rejectReason && response.data.currentStatus === "f005") {
      rejectReasonMsg.value = response.data.rejectReason;
    }
  } catch (err) {
    console.error(`정보 로딩 실패: ${err}`);
  }
});

// 승인 요청 버튼 클릭 시 실행할 함수 (뼈대만)
const submitRequest = async () => {
  // 1. 유효성 검사 (입력 확인)
  if (!selectedPriority.value) {
    alert("우선순위(계획/중점/긴급)를 선택해주세요!");
    return;
  }
  if (!reasonText.value.trim()) {
    alert("선택 사유를 입력해주세요!");
    return;
  }

  // 2. 주소창에서 조사지 ID 꺼내기 (예: SUV0019)
  const surveyId = route.params.id;

  try {
    // 💡 3. 백엔드로 POST 요청 쏘기! (data 덩어리를 같이 보냄)
    const response = await axios.post(
      `http://localhost:3000/priority/${surveyId}`,
      {
        priority: selectedPriority.value, // f001, f002, f003
        reason: reasonText.value, // 사용자가 입력한 텍스트
      },
    );

    // 💡 4. 백엔드가 성공했다고(200 OK) 답변을 주면?
    if (response.status === 200) {
      alert("우선순위 승인 요청이 완료되었습니다!");

      // 요청이 끝났으니 담당자 메인 화면으로 돌려보내기
      router.push("/manager");
    }
  } catch (err) {
    console.error("승인 요청 실패:", err);
    alert("승인 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
};

const goBack = () => {
  router.push("/manager");
};
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12 col-lg-8 mx-auto">
        <div
          v-if="rejectReasonMsg"
          class="alert alert-light border border-danger text-danger d-flex align-items-center mb-4"
          role="alert"
        >
          <div>
            <strong>🚨 관리자 반려 사유:</strong><br />
            {{ rejectReasonMsg }}
          </div>
        </div>

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
              <button class="btn btn-secondary mb-0" @click="goBack">
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
