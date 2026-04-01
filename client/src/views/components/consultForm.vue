<template>
  <div class="page-wrapper min-vh-100 pb-5">
    <header class="header-nav mx-4 mt-3 p-3 shadow-sm bg-white">
      <div
        class="d-flex justify-content-between align-items-center max-w-7xl mx-auto"
      >
        <div class="d-flex align-items-center gap-4">
          <h2 class="brand-text m-0">발달장애인 지원 프로그램</h2>
          <div class="nav-links d-flex gap-2">
            <button class="btn-nav active">🏠 첫 화면</button>
            <button class="btn-nav">📄 조사지신청</button>
          </div>
        </div>
        <div class="user-meta">
          <span class="me-3">예담지원센터, <strong>박담당</strong> 님!</span>
          <span class="auth-link">Mypage</span>
          <span class="divider">|</span>
          <span class="auth-link">Logout</span>
        </div>
      </div>
    </header>

    <main class="content-container mx-auto mt-4 shadow-sm bg-white">
      <div class="content-header p-4 border-bottom text-center">
        <h1 class="main-title m-0">상담 기록</h1>
      </div>

      <div class="p-5">
        <section class="mb-5">
          <h4 class="section-title mb-4">기본 정보</h4>
          <div class="info-grid">
            <div class="info-item">
              <label>상담 / 작성일자</label>
              <div class="d-flex gap-2">
                <input
                  type="date"
                  v-model="form.consultDate"
                  class="form-input"
                />
                <input
                  type="date"
                  v-model="form.writeDate"
                  class="form-input"
                />
              </div>
            </div>
            <div class="info-item">
              <label>상담 시간 (시작/종료)</label>
              <div class="d-flex gap-2">
                <input
                  type="text"
                  v-model="form.startTime"
                  placeholder="00:00:00"
                  class="form-input text-center"
                />
                <input
                  type="text"
                  v-model="form.endTime"
                  placeholder="00:00:00"
                  class="form-input text-center"
                />
              </div>
            </div>
            <div class="info-item">
              <label>장애 유형</label>
              <select
                v-model="form.disabilityType"
                class="form-input custom-select"
              >
                <option value="">유형 선택</option>
                <option
                  v-for="item in disabilityTypes"
                  :key="item.code"
                  :value="item.code"
                >
                  {{ item.description }}
                </option>
              </select>
            </div>
            <div class="info-item">
              <label>상담 장소</label>
              <input
                type="text"
                v-model="form.location"
                class="form-input"
                placeholder="장소 입력"
              />
            </div>
            <div class="info-item">
              <label>지원대상자</label>
              <select
                @change="handleUserChange"
                class="form-input custom-select"
              >
                <option value="">대상자 선택</option>
                <option
                  v-for="user in userList"
                  :key="user.I_UserId"
                  :value="user.I_UserId"
                >
                  {{ user.user_name }}
                </option>
              </select>
            </div>
            <div class="info-item">
              <label>보호자명</label>
              <input
                type="text"
                v-model="form.guardianName"
                class="form-input bg-light"
                placeholder="대상자를 선택하면 자동 입력됩니다"
                readonly
              />
            </div>

            <div class="info-item">
              <label>상담 방법</label>
              <input
                type="text"
                v-model="form.method"
                class="form-input"
                placeholder="방법 입력"
              />
            </div>
            <div class="info-item">
              <label>지원자 회원번호</label>
              <input
                type="text"
                v-model="form.memberId"
                class="form-input bg-light"
                readonly
              />
            </div>
            <div class="info-item">
              <label>담당자</label>
              <input
                type="text"
                v-model="form.manager"
                class="form-input fw-bold bg-light"
                readonly
              />
            </div>
          </div>
        </section>

        <section class="record-area mt-5">
          <h4 class="section-title mb-4">상담 기록 상세</h4>
          <div
            v-for="(item, idx) in sections"
            :key="idx"
            class="record-card mb-4"
          >
            <div class="record-label">{{ item.title }}</div>
            <textarea
              v-model="form.details[item.key]"
              class="record-textarea"
              rows="5"
              placeholder="상세 내용을 입력해 주세요."
            ></textarea>
          </div>
        </section>

        <footer class="d-flex justify-content-center gap-3 mt-5 pt-4">
          <button class="btn-action btn-prev">이전</button>
          <button class="btn-action btn-submit">등록</button>
          <button class="btn-action btn-cancel">취소</button>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const form = ref({
  consultDate: "",
  writeDate: "",
  startTime: "",
  endTime: "",
  disabilityType: "",
  location: "",
  targetName: "",
  guardianName: "",
  method: "",
  memberId: "",
  manager: "",
  details: {
    basic: "",
    content: "",
    needs: "",
    opinion: "",
  },
});

const sections = [
  { title: "기본 정보 요약", key: "basic" },
  { title: "주요 상담 내용", key: "content" },
  { title: "서비스 욕구 및 지원 필요성", key: "needs" },
  { title: "담당자 종합 의견", key: "opinion" },
];

const disabilityTypes = ref([]);
const userList = ref([]);

const handleUserChange = (event) => {
  const selectedId = event.target.value;
  const user = userList.value.find((u) => u.I_UserId === selectedId);

  if (user) {
    form.value.memberId = user.I_UserId; // 회원번호 자동입력
    form.value.targetName = user.user_name; // 대상자 이름 저장
    form.value.guardianName = user.support_name; // 보호자명 자동입력 (필드명 확인 필요)
  }
};

const fetchDisabilityTypes = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/consult/disability-types",
    );
    if (!response.ok) throw new Error("네트워크 응답 에러");
    const data = await response.json();
    disabilityTypes.value = data;
    console.log(data);
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
};

const fetchUsers = async () => {
  try {
    const response = await fetch("http://localhost:3000/consult/user");
    if (!response.ok) throw new Error("사용자 로드 에러");
    const data = await response.json();

    userList.value = data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchDisabilityTypes();
  fetchUsers();
});
</script>

<style scoped>
/* [기존 레이아웃 스타일 유지] */
.page-wrapper {
  background-color: #f8fafc;
  font-family:
    "Pretendard",
    -apple-system,
    sans-serif;
}
.header-nav {
  border-radius: 12px;
}
.brand-text {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
}
.btn-nav {
  border: none;
  background: #f1f5f9;
  color: #64748b;
  padding: 6px 18px;
  border-radius: 8px;
  font-weight: 600;
  transition: 0.2s;
}
.btn-nav.active {
  background: #4a7253;
  color: white;
}
.content-container {
  max-width: 1000px;
  border-radius: 16px;
  overflow: hidden;
}
.main-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #334155;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  position: relative;
  padding-left: 15px;
}
.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  background: #4a7253;
  border-radius: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 40px;
  background: #fdfdfd;
  padding: 25px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}
.info-item label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 8px;
}
.form-input {
  width: 100%;
  border: 1px solid #cbd5e1;
  padding: 10px 14px;
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #4a7253;
  box-shadow: 0 0 0 3px rgba(74, 114, 83, 0.1);
}

.record-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}
.record-label {
  background: #f8fafc;
  padding: 12px 20px;
  font-weight: 700;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
}
.record-textarea {
  width: 100%;
  border: none;
  padding: 20px;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  min-height: 120px;
}

/* [수정된 버튼 스타일] */
.btn-action {
  padding: 12px 45px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid transparent; /* 기본 테두리 설정 */
}
.btn-prev {
  background-color: #4a7253;
  border-color: #3d5e44;
  color: white;
}
.btn-prev:hover {
  background-color: #3d5e44;
  border-color: #2d4633;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 85, 105, 0.2);
}
.btn-submit {
  background-color: #4a7253;
  border-color: #3d5e44;
  color: white;
}
.btn-submit:hover {
  background-color: #3d5e44;
  border-color: #2d4633;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 114, 83, 0.2);
}

.btn-cancel {
  background-color: #4a7253;
  border-color: #3d5e44;
  color: white;
}
.btn-cancel:hover {
  background-color: #3d5e44;
  border-color: #2d4633;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(225, 112, 85, 0.2);
}

.auth-link {
  cursor: pointer;
  transition: 0.2s;
}
.divider {
  margin: 0 12px;
  color: #e2e8f0;
}
</style>
