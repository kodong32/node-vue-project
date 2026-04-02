<!-- D:\node-vue-project\client\src\views\components\NoticeDetail.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

// 💡 1. 사용자 권한 하드코딩 (NoticeList.vue와 동일하게 세팅)
const currentUserRole = ref("시스템관리자");

// 상태 관리
const notice = ref(null);

// 💡 2. 상세 데이터 불러오기
const fetchNoticeDetail = async () => {
  const noticeId = route.params.noticeId;
  if (!noticeId) return;

  try {
    const response = await axios.get(
      `http://localhost:3000/notice/${noticeId}`,
    );
    notice.value = response.data;
  } catch (error) {
    console.error("상세 정보를 불러오는 중 오류 발생:", error);
    alert("공지사항을 불러올 수 없습니다.");
    router.push("/notice/list");
  }
};

// 💡 3. 삭제 기능 (권한이 있는 사람만)
const deleteNotice = async () => {
  if (!confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

  try {
    const noticeId = route.params.noticeId;
    await axios.delete(`http://localhost:3000/notice/${noticeId}`);
    alert("삭제가 완료되었습니다.");
    router.push("/notice/list");
  } catch (error) {
    console.error("삭제 중 오류 발생:", error);
    alert("삭제에 실패했습니다.");
  }
};

const goBack = () => {
  router.push("/notice/list");
};

const goToEdit = () => {
  router.push(`/notice/edit/${route.params.noticeId}`);
};

// 💡 4. 수정/삭제 버튼 노출 권한 계산
// (시스템 관리자이거나, 작성자 본인일 때만 노출하는 로직이 들어가야 함! 지금은 관리자면 무조건 보이게 임시 설정)
const canEdit = computed(() => {
  return (
    currentUserRole.value === "시스템관리자" ||
    currentUserRole.value === "기관관리자"
  );
});

// 💡 5. 첨부파일이 하나라도 있는지 확인
const hasFiles = computed(() => {
  if (!notice.value) return false;
  return (
    notice.value.file1 ||
    notice.value.file2 ||
    notice.value.file3 ||
    notice.value.file4 ||
    notice.value.file5
  );
});

onMounted(() => {
  fetchNoticeDetail();
});
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12 col-lg-8 mx-auto">
        <div class="card mb-4 shadow-sm">
          <div class="card-header pb-0 border-bottom">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span
                class="badge"
                :class="
                  notice?.notice_type === 'ALL'
                    ? 'bg-gradient-danger'
                    : 'bg-gradient-info'
                "
              >
                {{
                  notice?.notice_type === "ALL" ? "시스템 공지" : "기관 공지"
                }}
              </span>
              <button
                class="btn btn-outline-secondary btn-sm mb-0"
                @click="goBack"
              >
                <i class="fas fa-list me-1"></i>목록으로
              </button>
            </div>
          </div>

          <div class="card-body pt-4">
            <div v-if="notice">
              <div class="text-center mb-5">
                <h3
                  class="font-weight-bolder mb-3"
                  :class="{ 'text-primary': notice.isImportant }"
                >
                  <i
                    v-if="notice.isImportant"
                    class="fas fa-thumbtack text-primary me-2"
                  ></i>
                  {{ notice.title }}
                </h3>
                <div
                  class="d-flex justify-content-center text-sm text-secondary gap-4"
                >
                  <span
                    ><i class="fas fa-user-circle me-1"></i>
                    {{
                      notice.writer_type === "a001"
                        ? "시스템관리자"
                        : "기관관리자"
                    }}</span
                  >
                  <span
                    ><i class="far fa-calendar-alt me-1"></i>
                    {{ notice.create_at }}</span
                  >
                </div>
              </div>

              <div
                class="p-4 bg-white border border-radius-lg min-vh-25 mb-4 shadow-sm-inset"
              >
                <p
                  class="text-dark text-md mb-0"
                  style="white-space: pre-wrap; line-height: 1.8"
                >
                  {{ notice.content }}
                </p>
              </div>

              <div v-if="hasFiles" class="border-top pt-4">
                <h6 class="text-sm font-weight-bold mb-3">
                  <i class="fas fa-paperclip me-2"></i>첨부파일
                </h6>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    v-if="notice.file1"
                    class="btn btn-sm btn-light border mb-0"
                  >
                    <i class="fas fa-download me-1"></i> {{ notice.file1 }}
                  </button>
                  <button
                    v-if="notice.file2"
                    class="btn btn-sm btn-light border mb-0"
                  >
                    <i class="fas fa-download me-1"></i> {{ notice.file2 }}
                  </button>
                  <button
                    v-if="notice.file3"
                    class="btn btn-sm btn-light border mb-0"
                  >
                    <i class="fas fa-download me-1"></i> {{ notice.file3 }}
                  </button>
                  <button
                    v-if="notice.file4"
                    class="btn btn-sm btn-light border mb-0"
                  >
                    <i class="fas fa-download me-1"></i> {{ notice.file4 }}
                  </button>
                  <button
                    v-if="notice.file5"
                    class="btn btn-sm btn-light border mb-0"
                  >
                    <i class="fas fa-download me-1"></i> {{ notice.file5 }}
                  </button>
                </div>
              </div>

              <div
                v-if="canEdit"
                class="d-flex justify-content-end gap-2 mt-5 border-top pt-4"
              >
                <button class="btn btn-info px-4" @click="goToEdit">
                  수정
                </button>
                <button class="btn btn-danger px-4" @click="deleteNotice">
                  삭제
                </button>
              </div>
            </div>

            <div v-else class="text-center py-5">
              <span class="spinner-border text-primary" role="status"></span>
              <p class="text-secondary mt-3">공지사항을 불러오는 중입니다...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-vh-25 {
  min-height: 25vh; /* 본문 영역 최소 높이 지정 */
}
</style>
