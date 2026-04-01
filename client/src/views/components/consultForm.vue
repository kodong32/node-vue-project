<template>
  <RoleHeader />

  <main class="content-container mx-auto mt-4 shadow-sm bg-white">
    <div class="content-header p-4 border-bottom text-center">
      <h1 class="main-title m-0">상담 기록</h1>
    </div>

    <div class="p-5">
      <section class="mb-5">
        <h4 class="section-title mb-4">기본 정보</h4>
        <div class="info-grid">
          <div class="info-item">
            <label>상담일자 / 작성일자</label>
            <div class="d-flex gap-2">
              <input
                type="date"
                v-model="form.consultDate"
                class="form-input"
              />
              <input type="date" v-model="form.writeDate" class="form-input" />
            </div>
          </div>
          <div class="info-item">
            <label>상담 시간 (시작/종료)</label>
            <div class="d-flex gap-2">
              <input
                type="time"
                v-model="form.startTime"
                class="form-input time-picker-custom text-center"
              />
              <input
                type="time"
                v-model="form.endTime"
                class="form-input time-picker-custom text-center"
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
            <select v-model="form.location" class="form-input custom-select">
              <option value="" disabled>장소 선택</option>
              <option
                v-for="place in placeList"
                :key="place.counsult_loc"
                :value="place.counsult_loc"
              >
                {{ place.counsult_loc }}
              </option>
            </select>
          </div>
          <div class="info-item">
            <label>지원대상자</label>
            <select @change="handleUserChange" class="form-input custom-select">
              <option value="">대상자 선택</option>
              <option
                v-for="user in uniqueUserList"
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
            <select v-model="form.method" class="form-input custom-select">
              <option value="">상담 방법 선택</option>
              <option
                v-for="method in methods"
                :key="method.counsult_method"
                :value="method.counsult_method"
              >
                {{ method.counsult_method }}
              </option>
            </select>
          </div>
          <div class="info-item">
            <label>지원자 회원번호</label>
            <input
              type="text"
              :value="generatedMemberId"
              class="form-input bg-light"
              readonly
            />
          </div>
          <div class="info-item">
            <label>정담당자</label>
            <select
              v-model="form.managerMainId"
              class="form-input custom-select"
            >
              <option value="">담당자 선택</option>
              <option
                v-for="m in filteredMainManagers"
                :key="m.I_UserId"
                :value="m.I_UserId"
              >
                {{ m.name }}
              </option>
            </select>
          </div>

          <div class="info-item">
            <label>부담당자</label>
            <select
              v-model="form.managerSubId"
              class="form-input custom-select"
            >
              <option value="">담당자 선택</option>
              <option
                v-for="m in filteredSubManagers"
                :key="m.I_UserId"
                :value="m.I_UserId"
              >
                {{ m.name }}
              </option>
            </select>
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
        <button class="btn-action btn-prev" @click="$router.back()">
          이전
        </button>
        <button class="btn-action btn-submit" @click="consultAdd()">
          등록
        </button>
        <button class="btn-action btn-cancel" @click="resetCancel">취소</button>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import RoleHeader from "../components/RoleHeader.vue";

const filteredMainManagers = computed(() => {
  return managerList.value.filter(
    (m) => m.I_UserId !== form.value.managerSubId,
  );
});

const filteredSubManagers = computed(() => {
  return managerList.value.filter(
    (m) => m.I_UserId !== form.value.managerMainId,
  );
});

const form = ref({
  consultDate: "",
  writeDate: "",
  startTime: "",
  endTime: "",
  disabilityType: "",
  location: "",
  targetId: "",
  targetName: "",
  guardianName: "",
  method: "",
  memberId: "",
  manager: "",
  managerMainId: "",
  managerSubId: "",
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
const placeList = ref([]);
const methods = ref([]);
const consultList = ref([]);
const managerList = ref([]);

//지원대상자 회원번호 자동증가
const generatedMemberId = computed(() => {
  const nextIndex = consultList.value.length + 1;
  return `G${String(nextIndex).padStart(4, "0")}`;
});

//지원대상자 선택
const handleUserChange = (event) => {
  const selectedId = event.target.value;
  const user = userList.value.find((u) => u.I_UserId === selectedId);

  if (user) {
    form.value.targetId = user.I_UserId;
    form.value.targetName = user.user_name;
    form.value.guardianName = user.support_name;
    form.value.support_id = user.support_id;
  } else {
    form.value.targetId = "";
    form.value.targetName = "";
    form.value.guardianName = "";
    form.value.support_id = "";
  }
};

//지원대상자 선택 (아이디 기준으로 중복되는 이름 제거)
const uniqueUserList = computed(() => {
  const seen = new Set();

  return userList.value.filter((user) => {
    if (seen.has(user.I_UserId)) return false;
    seen.add(user.I_UserId);
    return true;
  });
});

//전체 상담 기록 가져오는 함수 (회원번호 계산용)
const fetchConsultList = async () => {
  try {
    const response = await fetch("/api/consult/user");
    if (response.ok) {
      const data = await response.json();
      consultList.value = data;
    }
  } catch (error) {
    console.error("목록 로드 실패:", error);
  }
};

//장애유형
const fetchDisabilityTypes = async () => {
  try {
    const response = await fetch("/api/consult/disability-types");
    if (!response.ok) throw new Error("네트워크 응답 에러");
    const data = await response.json();
    disabilityTypes.value = data;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
};

//지원대상자
const fetchUsers = async () => {
  try {
    const response = await fetch("/api/consult/user");
    if (!response.ok) throw new Error("사용자 로드 에러");
    const data = await response.json();

    userList.value = data;
  } catch (error) {
    console.error(error);
  }
};

//상담장소
const fetchPlaces = async () => {
  try {
    const response = await fetch("/api/consult/place");
    if (!response.ok) throw new Error("장소 로드 에러");
    const data = await response.json();
    placeList.value = data.filter(
      (p) => p.counsult_loc && p.counsult_loc.trim() !== "",
    );
  } catch (error) {
    console.error("장소 데이터 로드 실패:", error);
  }
};

//상담방법
const fetchMethod = async () => {
  try {
    const response = await fetch("/api/consult/method");
    if (!response.ok) throw new Error("장소 로드 에러");
    const data = await response.json();
    methods.value = data;
  } catch (error) {
    console.error("장소 데이터 로드 실패:", error);
  }
};

//담당자 정/부
const fetchManagersList = async () => {
  try {
    const response = await fetch("/api/consult/manager");
    if (response.ok) {
      const data = await response.json();
      managerList.value = data;
    }
  } catch (error) {
    console.error("담당자 목록 로드 실패:", error);
  }
};

onMounted(() => {
  fetchConsultList();
  fetchDisabilityTypes();
  fetchUsers();
  fetchPlaces();
  fetchMethod();
  fetchManagersList();
});

//취소 버튼 (리셋)
const resetCancel = () => {
  if (confirm("작성 내용을 초기화하시겠습니까?")) {
    form.value = {
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
      managerMainId: "",
      managerSubId: "",
      details: {
        basic: "",
        content: "",
        needs: "",
        opinion: "",
      },
    };
    alert("초기화되었습니다.");
  }
};

//상담기록 등록
const isPrinted = ref(false);

import { useRouter } from "vue-router";
const router = useRouter();

const now = new Date().toISOString().slice(0, 10);

const consultAdd = async () => {
  try {
    if (
      !form.value.consultDate ||
      !form.value.writeDate ||
      !form.value.startTime ||
      !form.value.endTime ||
      !form.value.disabilityType ||
      !form.value.location ||
      !form.value.targetId ||
      !form.value.method ||
      !form.value.managerMainId
    ) {
      alert("기본 정보를 모두 입력해주세요.");
      return;
    }

    const currentManagerId = localStorage.getItem("userId") || "SUV0000";

    let data = {
      // counsult_id: info.counsult_id,
      J_ID: currentManagerId,
      I_UserId: form.value.targetId,
      support_id: form.value.support_id,

      counsult_date: form.value.consultDate,
      write_date: form.value.writeDate,
      counsult_loc: form.value.location,
      counsult_startTime: form.value.startTime,
      counsult_endTime: form.value.endTime,
      counsult_content: form.value.details.basic,
      counsult_content2: form.value.details.content,
      counsult_content3: form.value.details.needs,
      counsult_content4: form.value.details.opinion,
      updated_at: form.value.updatedDate || now,
      counsult_method: form.value.method,
    };

    if (!data.I_UserId) {
      alert("지원대상자를 선택해주세요.");
      return;
    }

    let response = await fetch("/api/consult/consultAdd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("서버 응답 실패");
    }

    const result = await response.json();

    if (result.status == "success") {
      router.push({
        name: "managerConsult",
        params: { no: result.counsult_no },
      });
    } else {
      console.error("등록 실패:", result);
      isPrinted.value = true;
    }
  } catch (err) {
    console.error("에러 발생:", err);
  }
};
</script>

<style scoped>
/* [기존 레이아웃 스타일 유지] */
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
  /* overflow: hidden; */
  overflow: visible !important;
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

.time-picker-custom {
  cursor: pointer;
  position: relative;
}

.time-picker-custom::-webkit-calendar-picker-indicator {
  cursor: pointer;
  padding: 5px;
  filter: invert(30%) sepia(10%) saturate(1000%) hue-rotate(90deg);
}

.p-5 {
  padding-bottom: 300px !important;
}
</style>
