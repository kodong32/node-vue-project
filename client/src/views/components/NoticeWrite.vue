<!-- D:\node-vue-project\client\src\views\components\NoticeWrite.vue -->
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
const currentInstiId = ref("");
const currentUserId = ref(""); // 🌟 [추가] 백엔드 401 에러 방지용 작성자 ID

const isEditMode = computed(() => !!route.params.noticeId);

const formData = ref({
  title: "",
  content: "",
  noticeDate: "",
  importantMark: "N",
  noticeType: "ALL", // 기본값
  file1: "",
  file2: "",
  file3: "",
  file4: "",
  file5: "",
});

const instiOptions = ref([{ value: "ALL", text: "전체 (시스템 공지)" }]);

const fetchInstitutions = async () => {
  try {
    const response = await axios.get("/api/admin/institution/list", {
      params: { limit: 100, page: 1 },
      withCredentials: true, // 🌟 세션 쿠키 확실히 전달!
    });

    if (response.data && response.data.data) {
      // 🌟 [수정 핵심] 이전 기관목록 코드를 보니 기관명이 inst.name 으로 들어오고 있었습니다!
      const realOptions = response.data.data.map((inst) => ({
        value: inst.institution_id,
        text: inst.name || inst.institution_name || "이름 없음", // DB 컬럼명에 맞게 유연하게 처리
      }));
      instiOptions.value = [
        { value: "ALL", text: "전체 (시스템 공지)" },
        ...realOptions,
      ];
    }
  } catch (error) {
    console.error("기관 목록 불러오기 실패:", error);
  }
};

// 🌟 2. 세션 확인 함수 (관리자 체크 완벽 추가!)
const checkSession = async () => {
  try {
    let isLogin = false;
    let userRole = "";
    let userId = "";
    let instId = "";

    // 1️⃣ 일반/기관 유저 세션 확인
    try {
      const userRes = await axios.get("/api/user/auth/me", {
        withCredentials: true,
      });
      if (userRes.data.isLogin) {
        isLogin = true;
        const user = userRes.data.user;
        userRole = user.role;
        userId = user.id || user.user_id || "";
        instId = user.institutionId || "";
      }
    } catch (err) {
      console.log("일반/기관 세션 없음, 관리자 확인 진행");
    }

    // 2️⃣ 시스템 관리자 세션 확인
    if (!isLogin) {
      try {
        const adminRes = await axios.get("/api/admin/me", {
          withCredentials: true,
        });
        if (adminRes.data.status === "Success") {
          isLogin = true;
          userRole = "a001"; // 시스템 관리자 권한
          // 관리자 ID가 세션에 없다면 최소한 'admin'이라는 글자라도 넣어서 401 방어!
          userId = adminRes.data.admin?.id || adminRes.data.id || "admin";
        }
      } catch (err) {
        console.log("시스템 관리자 세션 없음");
      }
    }

    // 3️⃣ 로그인 정보가 확인되면 화면 세팅!
    if (isLogin) {
      currentUserId.value = userId;

      if (userRole === "a001") {
        currentUserRole.value = "시스템관리자";
        fetchInstitutions(); // 기관 목록 불러오기!
      } else if (userRole === "a002") {
        currentUserRole.value = "기관관리자";
      }

      currentInstiId.value = instId;

      if (!isEditMode.value) {
        formData.value.noticeType = userRole === "a001" ? "ALL" : instId;
      }
    } else {
      // 진짜 아무 로그인도 안 되어있을 때
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      router.push("/user/login");
    }
  } catch (error) {
    console.error("세션 세팅 실패:", error);
  }
};

const fetchNoticeData = async () => {
  if (!isEditMode.value) return;

  try {
    const response = await axios.get(`/api/notice/${route.params.noticeId}`);
    const data = response.data;

    formData.value = {
      title: data.title,
      content: data.content,
      noticeDate: data.notice_date,
      importantMark: data.important_mark,
      noticeType: data.notice_type,
      file1: data.file1 || "",
      file2: data.file2 || "",
      file3: data.file3 || "",
      file4: data.file4 || "",
      file5: data.file5 || "",
    };
  } catch (error) {
    console.error("정보를 불러오는 중 오류 발생:", error);
    router.push("/notice/list");
  }
};

const uploadFiles = ref({
  file1: null,
  file2: null,
  file3: null,
  file4: null,
  file5: null,
});

const handleFileUpload = (event, fieldName) => {
  uploadFiles.value[fieldName] = event.target.files[0];
};

const submitForm = async () => {
  if (!formData.value.title.trim()) return alert("제목을 입력해주세요.");
  if (!formData.value.content.trim()) return alert("본문 내용을 입력해주세요.");
  if (!formData.value.noticeDate)
    return alert("공개 종료 기한을 선택해주세요.");

  const form = new FormData();
  form.append("title", formData.value.title);
  form.append("content", formData.value.content);
  form.append("noticeDate", formData.value.noticeDate);
  form.append("importantMark", formData.value.importantMark);
  form.append("noticeType", formData.value.noticeType);

  // 🌟 [핵심] 401 권한 에러 방지: 백엔드가 폼 데이터에서 명시적으로 작성자를 찾을 수도 있으니 같이 쏴줍니다!
  form.append(
    "writerRole",
    currentUserRole.value === "시스템관리자" ? "a001" : "a002",
  );
  form.append("writerId", currentUserId.value);

  if (uploadFiles.value.file1) form.append("file1", uploadFiles.value.file1);
  if (uploadFiles.value.file2) form.append("file2", uploadFiles.value.file2);
  if (uploadFiles.value.file3) form.append("file3", uploadFiles.value.file3);
  if (uploadFiles.value.file4) form.append("file4", uploadFiles.value.file4);
  if (uploadFiles.value.file5) form.append("file5", uploadFiles.value.file5);

  try {
    if (isEditMode.value) {
      await axios.put(`/api/notice/${route.params.noticeId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // 🌟 필수!
      });
      alert("성공적으로 수정되었습니다!");
      router.push(`/notice/detail/${route.params.noticeId}`);
    } else {
      await axios.post("/api/notice/write", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // 🌟 필수!
      });
      alert("성공적으로 등록되었습니다!");
      router.push("/notice/list");
    }
  } catch (error) {
    console.error("저장 중 오류 발생:", error);

    // 🌟 에러 추적을 위한 친절한 알림 추가
    if (error.response && error.response.status === 401) {
      alert(
        `[401 권한 에러]\n백엔드 주소가 정확한지 확인해주세요!\n(예: /api/notice/write가 아니라 /api/admin/notice/write 일 수 있습니다.)`,
      );
    } else {
      alert("처리 중 서버 오류가 발생했습니다.");
    }
  }
};

const goBack = () => {
  router.push("/notice/list");
};

onMounted(() => {
  checkSession();
  fetchNoticeData();
});
</script>

<template>
  <div class="container-fluid py-4">
    <template v-if="currentUserRole !== ''">
      <AdminHeader v-if="currentUserRole === '시스템관리자'" />
      <RoleHeader v-else />
    </template>
    <div class="row mt-4">
      <div class="col-12 col-lg-10 mx-auto">
        <div class="card shadow-sm">
          <div class="card-header pb-0 border-bottom">
            <h5 class="mb-3">
              <i class="fas fa-edit text-primary me-2"></i>
              {{ currentUserRole }} 공지사항 {{ isEditMode ? "수정" : "작성" }}
            </h5>
          </div>

          <div class="card-body">
            <div class="row mb-4 align-items-end">
              <div class="col-md-4" v-if="currentUserRole === '시스템관리자'">
                <label class="form-control-label text-sm"
                  >공지 유형 (대상)</label
                >
                <select class="form-select" v-model="formData.noticeType">
                  <option
                    v-for="opt in instiOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.text }}
                  </option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-control-label text-sm">공개 종료 기한</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="formData.noticeDate"
                />
              </div>

              <div class="col-md-4 pb-2">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="importantCheck"
                    :true-value="'Y'"
                    :false-value="'N'"
                    v-model="formData.importantMark"
                  />
                  <label
                    class="form-check-label text-sm font-weight-bold text-danger cursor-pointer"
                    for="importantCheck"
                  >
                    <i class="fas fa-exclamation-circle me-1"></i> 중요! (상단
                    강조)
                  </label>
                </div>
              </div>
            </div>

            <div class="form-group mb-4">
              <label class="form-control-label text-sm">제목</label>
              <input
                type="text"
                class="form-control"
                placeholder="공지사항 제목을 입력하세요"
                v-model="formData.title"
              />
            </div>

            <div class="form-group mb-4">
              <label class="form-control-label text-sm">본문 내용</label>

              <div
                class="border border-bottom-0 rounded-top p-2 bg-light d-flex gap-2 text-secondary"
              >
                <button class="btn btn-sm btn-link text-dark p-1 mb-0">
                  <i class="fas fa-bold"></i>
                </button>
                <button class="btn btn-sm btn-link text-dark p-1 mb-0">
                  <i class="fas fa-italic"></i>
                </button>
                <button class="btn btn-sm btn-link text-dark p-1 mb-0">
                  <i class="fas fa-underline"></i>
                </button>
                <div class="border-end mx-1"></div>
                <button class="btn btn-sm btn-link text-dark p-1 mb-0">
                  <i class="fas fa-align-left"></i>
                </button>
                <button class="btn btn-sm btn-link text-dark p-1 mb-0">
                  <i class="fas fa-align-center"></i>
                </button>
                <button class="btn btn-sm btn-link text-dark p-1 mb-0">
                  <i class="fas fa-image"></i>
                </button>
              </div>

              <textarea
                class="form-control border-top-0 rounded-0 rounded-bottom"
                rows="15"
                placeholder="내용을 입력하세요..."
                v-model="formData.content"
              ></textarea>
            </div>

            <div class="form-group mb-4 p-3 bg-light border-radius-lg">
              <label class="form-control-label text-sm"
                ><i class="fas fa-paperclip me-1"></i> 첨부파일 (최대
                5개)</label
              >
              <div class="row mt-2">
                <div class="col-md-6 mb-2">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    @change="handleFileUpload($event, 'file1')"
                  />
                </div>
                <div class="col-md-6 mb-2">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    @change="handleFileUpload($event, 'file2')"
                  />
                </div>
                <div class="col-md-6 mb-2">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    @change="handleFileUpload($event, 'file3')"
                  />
                </div>
                <div class="col-md-6 mb-2">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    @change="handleFileUpload($event, 'file4')"
                  />
                </div>
                <div class="col-md-6">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    @change="handleFileUpload($event, 'file5')"
                  />
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-center gap-3 mt-5">
              <button class="btn btn-primary px-5 mb-0" @click="submitForm">
                {{ isEditMode ? "수정 완료" : "등록하기" }}
              </button>
              <button
                class="btn btn-outline-secondary px-4 mb-0"
                @click="goBack"
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
.cursor-pointer {
  cursor: pointer;
}
/* textarea 스크롤바 꾸미기 */
textarea {
  resize: vertical;
}
</style>
