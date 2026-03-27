<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

// 상태 관리
const candidateInfo = ref(null);
const requestInfo = ref({
  priorityCode: "", // 'f002' 같은 원본 코드 (나중에 승인할 때 돌려줘야 함)
  priorityText: "", // '중점' 같은 화면 표시용 한글
  reason: "", // 담당자가 적은 사유
});

const showRejectInput = ref(false);
const rejectReasonText = ref("");

// 💡 화면 켜질 때 DB에서 2가지 데이터 다 가져오기!
onMounted(async () => {
  const surveyId = route.params.id;

  try {
    // 1. 지원자 기본 정보
    const candidateRes = await axios.get(
      `http://localhost:3000/priority/${surveyId}`,
    );
    candidateInfo.value = candidateRes.data;

    // 2. 담당자가 올린 결재 대기 정보(사유, 요청단계)
    const requestRes = await axios.get(
      `http://localhost:3000/priority/request-info/${surveyId}`,
    );
    if (requestRes.data) {
      requestInfo.value = requestRes.data;
    }
  } catch (err) {
    console.error("정보 로딩 실패:", err);
  }
});

// 💡 [승인] 버튼 클릭 시 백엔드로 POST 쏘기
const approveRequest = async () => {
  if (confirm("이 우선순위 요청을 승인하시겠습니까?")) {
    try {
      const surveyId = route.params.id;
      const response = await axios.post(
        `http://localhost:3000/priority/decide/${surveyId}`,
        {
          action: "approve",
          reqPriorityCode: requestInfo.value.priorityCode, // 예: 원래 요청했던 'f002'를 같이 보냄
        },
      );

      if (response.status === 200) {
        alert("승인이 완료되었습니다!");
        router.push("/general"); // 완료 후 메인화면으로!
      }
    } catch (err) {
      console.error("승인 처리 에러:", err);
      alert("처리 중 서버 오류가 발생했습니다.");
    }
  }
};

// 💡 [반려 등록] 버튼 클릭 시 백엔드로 POST 쏘기
const submitReject = async () => {
  if (!rejectReasonText.value.trim()) {
    alert("반려 사유를 입력해주세요!");
    return;
  }

  if (confirm("정말 반려하시겠습니까?")) {
    try {
      const surveyId = route.params.id;
      const response = await axios.post(
        `http://localhost:3000/priority/decide/${surveyId}`,
        {
          action: "reject",
          rejectReason: rejectReasonText.value, // 관리자가 빡쳐서(?) 적은 반려 사유
        },
      );

      if (response.status === 200) {
        alert("반려 처리되었습니다!");
        router.push("/general");
      }
    } catch (err) {
      console.error("반려 처리 에러:", err);
      alert("처리 중 서버 오류가 발생했습니다.");
    }
  }
};

const goBack = () => {
  router.push("/general");
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
            <div v-else class="text-center py-3">로딩중...</div>
          </div>
        </div>

        <div class="card text-center">
          <div class="card-header pb-0">
            <h5 class="mb-0">
              {{ candidateInfo?.supportName || "지원자" }} 님의 대기단계 요청
            </h5>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <div
                class="d-inline-flex justify-content-center align-items-center bg-gradient-success text-white rounded-circle shadow"
                style="width: 100px; height: 100px"
              >
                <h4 class="text-white mb-0">
                  {{ requestInfo.priorityText || "로딩중" }}
                </h4>
              </div>
            </div>

            <div
              class="text-start bg-light p-3 rounded mb-4 mx-auto"
              style="max-width: 500px"
            >
              <h6 class="text-sm">📌 우선순위 선택 사유:</h6>
              <p class="text-sm mb-0 text-dark">{{ requestInfo.reason }}</p>
            </div>

            <h6 class="mb-4">승인하시겠습니까?</h6>

            <div
              class="d-flex justify-content-center gap-3 mb-3"
              v-if="!showRejectInput"
            >
              <button class="btn btn-primary px-5" @click="approveRequest">
                승인
              </button>
              <button
                class="btn btn-outline-danger px-5"
                @click="showRejectInput = true"
              >
                반려
              </button>
              <button class="btn btn-secondary px-4" @click="goBack">
                목록으로
              </button>
            </div>

            <div
              v-if="showRejectInput"
              class="mx-auto"
              style="max-width: 500px"
            >
              <div class="form-group text-start">
                <label class="form-control-label text-danger"
                  >반려 사유 (필수)</label
                >
                <textarea
                  class="form-control border-danger"
                  rows="4"
                  v-model="rejectReasonText"
                  placeholder="반려 사유를 상세히 적어주세요."
                ></textarea>
              </div>
              <div class="d-flex justify-content-center gap-2 mt-3">
                <button class="btn btn-danger" @click="submitReject">
                  반려 등록
                </button>
                <button
                  class="btn btn-secondary"
                  @click="showRejectInput = false"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
