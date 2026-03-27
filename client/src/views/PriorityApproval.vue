<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

// 상태 관리
const candidateInfo = ref(null); // 지원자 정보
const requestInfo = ref({
  priorityCode: "중점", // 테스트용 하드코딩 (나중에 DB에서 가져올 예정)
  reason:
    "대상자의 생활 상황 및 지원 욕구를 종합적으로 고려한 결과 중점적인 지원이 필요하다고 판단됨.",
});

const showRejectInput = ref(false); // 반려 사유 입력창 표시 여부
const rejectReasonText = ref(""); // 입력한 반려 사유

// 화면 켜질 때 데이터 가져오기
onMounted(async () => {
  const surveyId = route.params.id;

  // 💡 상단 지원자 정보는 기존에 만든 API 재활용!
  try {
    const response = await axios.get(
      `http://localhost:3000/priority/${surveyId}`,
    );
    candidateInfo.value = response.data;

    // TODO: 백엔드 API가 완성되면 여기서 '요청된 우선순위'와 '사유'도 같이 불러와서 requestInfo에 담을 거야!
  } catch (err) {
    console.error("정보 로딩 실패:", err);
  }
});

// [승인] 버튼 클릭
const approveRequest = () => {
  if (confirm("이 우선순위 요청을 승인하시겠습니까?")) {
    alert("승인이 완료되었습니다! (백엔드 연결 대기중)");
    console.log("승인 쏠 데이터:", route.params.id);
    router.push("/general"); // 목록으로 이동
  }
};

// [반려 등록] 버튼 클릭 (사유 적고 최종 제출)
const submitReject = () => {
  if (!rejectReasonText.value.trim()) {
    alert("반려 사유를 입력해주세요!");
    return;
  }

  if (confirm("정말 반려하시겠습니까?")) {
    alert("반려 처리되었습니다! (백엔드 연결 대기중)");
    console.log("반려 쏠 데이터:", {
      id: route.params.id,
      reason: rejectReasonText.value,
    });
    router.push("/general"); // 목록으로 이동
  }
};

// 뒤로가기
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
                <h4 class="text-white mb-0">{{ requestInfo.priorityCode }}</h4>
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
