<!-- D:\node-vue-project\client\src\views\components\NoticeDetail.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import RoleHeader from "./RoleHeader.vue";
import AdminHeader from "@/views/components/adminPageHeader.vue";

const route = useRoute();
const router = useRouter();

// 💡 1. 빈 바구니 준비
const currentUserRole = ref("");

const notice = ref(null);

const fetchNoticeDetail = async () => {
  const noticeId = route.params.noticeId;
  if (!noticeId) return;

  try {
    const response = await axios.get(`/api/notice/${noticeId}`, {
      withCredentials: true, // 이 옵션을 켜야 8080 포트에서 3000 포트로 세션 쿠키가 날아감!
    });
    notice.value = response.data;
  } catch (error) {
    console.error("상세 정보를 불러오는 중 오류 발생:", error);
    alert("공지사항을 불러올 수 없습니다.");
    router.push("/notice/list");
  }
};

// 🌟 2. 세션 확인 함수 추가
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      const user = response.data.user;
      if (user.role === "a001") currentUserRole.value = "시스템관리자";
      else if (user.role === "a002") currentUserRole.value = "기관관리자";
      else if (user.role === "a003") currentUserRole.value = "기관담당자";
      else currentUserRole.value = "일반이용자";
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

const deleteNotice = async () => {
  if (!confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

  try {
    const noticeId = route.params.noticeId;
    await axios.delete(`/api/notice/${noticeId}`);
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

const canEdit = computed(() => {
  return (
    currentUserRole.value === "시스템관리자" ||
    currentUserRole.value === "기관관리자"
  );
});

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

const downloadFile = (fileName) => {
  if (!fileName) return;
  // 백엔드의 파일 다운로드 API 주소로 직접 연결 (브라우저가 알아서 다운로드 처리함)
  const url = `/api/notice/download/${encodeURIComponent(fileName)}`;
  window.location.href = url;
};

onMounted(() => {
  // 🌟 세션부터 확인하고 상세 정보를 가져옴
  checkSession();
  fetchNoticeDetail();
});
</script>

<template>
  <div class="container-fluid py-4">
    <template v-if="currentUserRole !== ''">
      <AdminHeader v-if="currentUserRole === '시스템관리자'" />
      <RoleHeader v-else />
    </template>
    <div class="row mt-4">
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
                    @click="downloadFile(notice.file1)"
                  >
                    <i class="fas fa-download me-1"></i> {{ notice.file1 }}
                  </button>

                  <button
                    v-if="notice.file2"
                    class="btn btn-sm btn-light border mb-0"
                    @click="downloadFile(notice.file2)"
                  >
                    <i class="fas fa-download me-1"></i> {{ notice.file2 }}
                  </button>

                  <button
                    v-if="notice.file3"
                    class="btn btn-sm btn-light border mb-0"
                    @click="downloadFile(notice.file3)"
                  >
                    <i class="fas fa-download me-1"></i> {{ notice.file3 }}
                  </button>

                  <button
                    v-if="notice.file4"
                    class="btn btn-sm btn-light border mb-0"
                    @click="downloadFile(notice.file4)"
                  >
                    <i class="fas fa-download me-1"></i> {{ notice.file4 }}
                  </button>

                  <button
                    v-if="notice.file5"
                    class="btn btn-sm btn-light border mb-0"
                    @click="downloadFile(notice.file5)"
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
