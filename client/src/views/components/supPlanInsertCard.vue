<script setup>
import { reactive, onMounted } from "vue";

const MAX_TOTAL_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const planInfo = reactive({
  I_UserId: "",
  writer: "",
  startDate: "",
  endDate: "",
  purpose: "",
  content: "",
  file1: null,
  file2: null,
});

const insertPlan = async () => {
  try {
    if (!planInfo.startDate) {
      alert("지원 시작일을 입력하세요.");
      return;
    }

    if (!planInfo.endDate) {
      alert("지원 종료일을 입력하세요.");
      return;
    }

    if (!planInfo.purpose) {
      alert("지원 목적을 입력하세요.");
      return;
    }

    if (!planInfo.content) {
      alert("지원 내용을 입력하세요.");
      return;
    }

    const totalFileSize =
      (planInfo.file1 ? planInfo.file1.size : 0) +
      (planInfo.file2 ? planInfo.file2.size : 0);

    if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
      alert("첨부파일 총 용량은 50MB를 초과할 수 없습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("writer", planInfo.writer);
    formData.append("I_UserId", planInfo.I_UserId);
    formData.append("startDate", planInfo.startDate);
    formData.append("endDate", planInfo.endDate);
    formData.append("purpose", planInfo.purpose);
    formData.append("content", planInfo.content);

    if (planInfo.file1) formData.append("file1", planInfo.file1);
    if (planInfo.file2) formData.append("file2", planInfo.file2);

    const response = await fetch("/api/manager/insertplan", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await response.json();

    if (result.status === "Success") {
      alert("지원계획서가 등록되었습니다.");

      planInfo.startDate = "";
      planInfo.endDate = "";
      planInfo.purpose = "";
      planInfo.content = "";
      planInfo.file1 = null;
      planInfo.file2 = null;
    } else {
      alert(result.message || "등록 실패");
    }
  } catch (err) {
    console.log("지원계획서 등록 오류", err);
    alert("등록 중 오류가 발생했습니다.");
  }
};

onMounted(async () => {
  try {
    const response = await fetch("/api/user/isession-check", {
      credentials: "include",
    });

    const result = await response.json();

    if (result.isLogin) {
      planInfo.I_UserId = result.user.I_UserId;
      planInfo.writer = result.user.name;
    }
  } catch (err) {
    console.log("세션 확인 오류", err);
  }
});

const handleFileChange = (e, target) => {
  const file = e.target.files[0] || null;

  if (target === "file1") {
    planInfo.file1 = file;
  } else if (target === "file2") {
    planInfo.file2 = file;
  }

  const totalFileSize =
    (planInfo.file1 ? planInfo.file1.size : 0) +
    (planInfo.file2 ? planInfo.file2.size : 0);

  if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
    alert("첨부파일 총 용량은 50MB를 초과할 수 없습니다.");

    if (target === "file1") {
      planInfo.file1 = null;
    } else if (target === "file2") {
      planInfo.file2 = null;
    }

    e.target.value = "";
  }
};
</script>

<template>
  <div class="card shadow-lg border-0">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h4 class="mb-1">지원계획서 등록</h4>
          <p class="text-sm mb-0 text-secondary">
            지원 대상자에 대한 지원계획 내용을 작성합니다.
          </p>
        </div>
      </div>
    </div>

    <div class="card-body">
      <div class="mb-4">
        <h6 class="mb-3">기본 정보</h6>
        <div class="mb-3">
          <label class="form-control-label mb-2">작성자</label>
          <input type="text" class="form-control" :value="planInfo.writer" readonly />
        </div>
      </div>

      <div class="mb-4">
        <h6 class="mb-3">지원 기간</h6>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-control-label mb-2">지원 시작일</label>
            <input type="date" class="form-control" v-model="planInfo.startDate" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-control-label mb-2">지원 종료일</label>
            <input type="date" class="form-control" v-model="planInfo.endDate" />
          </div>
        </div>
      </div>

      <div class="mb-4">
        <label class="form-control-label mb-2">지원 목적</label>
        <input
          type="text"
          class="form-control"
          v-model="planInfo.purpose"
          placeholder="지원 목적을 입력하세요"
        />
      </div>

      <div class="mb-4">
        <label class="form-control-label mb-2">지원 내용</label>
        <textarea
          rows="10"
          class="form-control"
          v-model="planInfo.content"
          placeholder="지원 계획 내용을 입력하세요"
        ></textarea>
      </div>

      <div class="mb-4">
        <h6 class="mb-3">첨부 파일</h6>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-control-label mb-2">파일 1</label>
            <input
              type="file"
              class="form-control"
              @change="handleFileChange($event, 'file1')"
            />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-control-label mb-2">파일 2</label>
            <input
              type="file"
              class="form-control"
              @change="handleFileChange($event, 'file2')"
            />
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button type="button" class="btn bg-gradient-dark mb-0" @click="insertPlan">
          등록
        </button>
      </div>
    </div>
  </div>
</template>
