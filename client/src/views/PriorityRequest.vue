<!-- PriorityRequest.vue -->
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

// 상태 관리 변수들
const candidateInfo = ref(null);
const selectedPriority = ref("");
const reasonText = ref("");
const rejectReasonMsg = ref("");

// 💡 1. 읽기 전용 상태인지 확인할 스위치 변수 추가!
const isReadOnly = ref(false);

onMounted(async () => {
  const surveyId = route.params.id;

  if (!surveyId) {
    alert("조사지 정보가 없습니다!");
    return;
  }

  try {
    const response = await axios.get(`/api/priority/${surveyId}`);
    candidateInfo.value = response.data;

    // 현재 상태가 '심사중(f004)'이더라도, 반려 사유 띄우기
    if (response.data.rejectReason) {
      rejectReasonMsg.value = response.data.rejectReason;
    }

    // 🌟 2. 심사중 상태 체크 (백엔드의 '심사중' 상태 코드에 맞게 수정 필요! 보통 'f004' 등)
    if (
      response.data.currentStatus === "f004" ||
      response.data.currentStatus === "심사중"
    ) {
      isReadOnly.value = true; // 읽기 전용 모드 ON!

      // 상세 정보(우선순위 코드, 사유) 전용 API 호출
      const detailRes = await axios.get(
        `/api/priority/request-info/${surveyId}`,
      );

      if (detailRes.data) {
        // 백엔드 SQL(selectApprovalWaitInfo)에서 정해준 이름 그대로 매칭!
        selectedPriority.value = detailRes.data.priorityCode || "";
        reasonText.value = detailRes.data.reason || "";
      }
    }
  } catch (err) {
    console.error(`정보 로딩 실패: ${err}`);
  }
});

const submitRequest = async () => {
  if (!selectedPriority.value) {
    alert("우선순위(계획/중점/긴급)를 선택해주세요!");
    return;
  }
  if (!reasonText.value.trim()) {
    alert("선택 사유를 입력해주세요!");
    return;
  }

  const surveyId = route.params.id;

  try {
    const response = await axios.post(`/api/priority/${surveyId}`, {
      priority: selectedPriority.value,
      reason: reasonText.value,
    });

    if (response.status === 200) {
      alert("우선순위 승인 요청이 완료되었습니다!");
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
              <span v-if="isReadOnly" class="badge bg-secondary ms-2 text-xs"
                >심사중 (읽기 전용)</span
              >
            </h6>
          </div>
          <div class="card-body">
            <div
              v-if="rejectReasonMsg"
              class="p-3 mb-4 border border-radius-md"
              style="
                background-color: #fff0f0;
                border-color: #ffc6c6 !important;
              "
            >
              <h6 class="text-danger text-sm mb-2 font-weight-bold">
                <i class="fas fa-exclamation-circle me-1"></i>이전 반려 사유
              </h6>
              <p class="text-sm text-dark mb-0">
                {{ rejectReasonMsg }}
              </p>
            </div>

            <div class="d-flex justify-content-center gap-3 mb-4 mt-3">
              <button
                class="btn btn-outline-info px-5"
                :class="{ active: selectedPriority === 'f001' }"
                @click="if (!isReadOnly) selectedPriority = 'f001';"
                :disabled="isReadOnly"
              >
                계획
              </button>
              <button
                class="btn btn-outline-success px-5"
                :class="{ active: selectedPriority === 'f002' }"
                @click="if (!isReadOnly) selectedPriority = 'f002';"
                :disabled="isReadOnly"
              >
                중점
              </button>
              <button
                class="btn btn-outline-danger px-5"
                :class="{ active: selectedPriority === 'f003' }"
                @click="if (!isReadOnly) selectedPriority = 'f003';"
                :disabled="isReadOnly"
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
                :disabled="isReadOnly"
              ></textarea>
            </div>

            <div class="d-flex justify-content-center gap-2">
              <button
                v-if="!isReadOnly"
                class="btn btn-primary mb-0"
                @click="submitRequest"
              >
                승인 요청
              </button>
              <button class="btn btn-secondary mb-0" @click="goBack">
                {{ isReadOnly ? "목록으로" : "취소" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
/* 읽기 전용일 때 버튼 마우스 포인터 없애기 */
button:disabled {
  cursor: not-allowed;
}
</style>
