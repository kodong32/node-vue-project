<!-- D:\node-vue-project\client\src\views\components\NoticeWrite.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

// 💡 1. 사용자 권한 및 소속 기관 하드코딩 (테스트용)
const currentUserRole = ref("시스템관리자"); // '시스템관리자' 또는 '기관관리자'로 바꿔가며 테스트!
const currentInstiId = ref("INST0000"); // 기관 관리자일 경우 소속된 기관 ID

// 💡 2. 작성(Write) 모드인지 수정(Edit) 모드인지 판별
const isEditMode = computed(() => !!route.params.noticeId);

// 💡 3. 폼 데이터 상태 관리
const formData = ref({
  title: "",
  content: "",
  noticeDate: "", // 공개 종료 기한
  importantMark: "N", // 'Y' or 'N'
  noticeType:
    currentUserRole.value === "시스템관리자" ? "ALL" : currentInstiId.value,
  // 첨부파일 (현재는 파일 이름 텍스트만 저장)
  file1: "",
  file2: "",
  file3: "",
  file4: "",
  file5: "",
});

// 시스템 관리자용 기관 목록 (실제로는 DB에서 불러와야 함)
const instiOptions = ref([
  { value: "ALL", text: "전체 (시스템 공지)" },
  { value: "INST0000", text: "대구발달장애센터" },
  { value: "INST0001", text: "서울발달장애센터" },
]);

// 💡 4. 수정 모드일 때 기존 데이터 불러오기
const fetchNoticeData = async () => {
  if (!isEditMode.value) return; // 작성 모드면 패스!

  try {
    const response = await axios.get(
      `http://localhost:3000/notice/${route.params.noticeId}`,
    );
    const data = response.data;

    // 불러온 데이터를 폼에 채워 넣기
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
    console.error("공지사항 정보를 불러오는 중 오류 발생:", error);
    alert("데이터를 불러올 수 없습니다.");
    router.push("/notice/list");
  }
};

// 💡 5. 저장 (등록 또는 수정) 실행
const submitForm = async () => {
  // 유효성 검사 (빈칸 방지)
  if (!formData.value.title.trim()) return alert("제목을 입력해주세요.");
  if (!formData.value.content.trim()) return alert("본문 내용을 입력해주세요.");
  if (!formData.value.noticeDate)
    return alert("공개 종료 기한을 선택해주세요.");

  // 백엔드로 보낼 데이터 세팅
  const payload = {
    ...formData.value,
    writerType: currentUserRole.value === "시스템관리자" ? "a001" : "a002",
    writerId: "IUSR0001", // 실제로는 로그인 세션에서 가져온 내 ID
  };

  try {
    if (isEditMode.value) {
      // 수정 (PUT)
      await axios.put(
        `http://localhost:3000/notice/${route.params.noticeId}`,
        payload,
      );
      alert("성공적으로 수정되었습니다!");
      router.push(`/notice/detail/${route.params.noticeId}`);
    } else {
      // 신규 등록 (POST)
      await axios.post("http://localhost:3000/notice/write", payload);
      alert("성공적으로 등록되었습니다!");
      router.push("/notice/list");
    }
  } catch (error) {
    console.error("저장 중 오류 발생:", error);
    alert("처리 중 서버 오류가 발생했습니다.");
  }
};

const goBack = () => {
  router.push("/notice/list");
};

onMounted(() => {
  fetchNoticeData();
});
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
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
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="첨부파일 1 이름 (임시)"
                    v-model="formData.file1"
                  />
                </div>
                <div class="col-md-6 mb-2">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="첨부파일 2 이름 (임시)"
                    v-model="formData.file2"
                  />
                </div>
                <div class="col-md-6 mb-2">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="첨부파일 3 이름 (임시)"
                    v-model="formData.file3"
                  />
                </div>
                <div class="col-md-6 mb-2">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="첨부파일 4 이름 (임시)"
                    v-model="formData.file4"
                  />
                </div>
                <div class="col-md-6">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="첨부파일 5 이름 (임시)"
                    v-model="formData.file5"
                  />
                </div>
              </div>
              <small class="text-muted text-xs mt-2 d-block"
                >* 현재는 테스트용 텍스트 입력창입니다. 추후 네이버 클라우드
                파일 업로더로 교체됩니다.</small
              >
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
