<template>
  <RoleHeader />

  <main class="content-container mx-auto mt-4 shadow-sm bg-white">
    <div class="content-header p-4 border-bottom text-center">
      <h1 class="main-title m-0">상담 기록 등록</h1>
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
            <label>장애유형(대분류)</label>
            <input
              type="text"
              :value="disabilityTypeName"
              class="form-input bg-light"
              placeholder="지원대상자를 선택하면 자동 입력됩니다"
              readonly
            />
          </div>

          <div class="info-item">
            <label>장애유형(중분류)</label>
            <input
              type="text"
              :value="consultMiddleNames"
              class="form-input bg-light"
              placeholder="지원대상자를 선택하면 자동 입력됩니다"
              readonly
            />
          </div>
          <div class="info-item">
            <label>상담 장소</label>
            <select v-model="form.location" class="form-input custom-select">
              <option value="">장소 선택</option>
              <option>센터</option>
              <option>지원대상자집</option>
              <option>외부장소</option>
              <option>온라인</option>
            </select>
          </div>
          <div class="info-item">
            <label>지원대상자</label>
            <select
              v-model="form.targetId"
              @change="handleUserChange"
              class="form-input custom-select"
            >
              <option value="">지원대상자 선택</option>

              <option
                v-for="user in uniqueUserList"
                :key="user.support_id"
                :value="user.support_id"
              >
                {{ user.support_name }}
              </option>
            </select>
          </div>
          <div class="info-item">
            <label>보호자명</label>
            <input
              type="text"
              v-model="form.guardianName"
              class="form-input bg-light"
              placeholder="지원대상자를 선택하면 자동 입력됩니다"
              readonly
            />
          </div>

          <div class="info-item">
            <label>상담 방법</label>
            <select v-model="form.method" class="form-input custom-select">
              <option value="">상담 방법 선택</option>
              <option>방문상담</option>
              <option>전화상담</option>
              <option>채팅상담</option>
              <option>영상통화</option>
            </select>
          </div>

          <div class="info-item">
            <label>정담당자</label>
            <input
              type="text"
              :value="managerMainName"
              class="form-input bg-light"
              placeholder="지원대상자를 선택하면 자동 입력됩니다"
              readonly
            />
          </div>

          <div class="info-item">
            <label>부담당자</label>
            <input
              type="text"
              :value="managerSubName"
              class="form-input bg-light"
              placeholder="지원대상자를 선택하면 자동 입력됩니다"
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

const form = ref({
  consultDate: "",
  writeDate: "",
  startTime: "",
  endTime: "",
  disabilityTypes: "",
  consultMiddle: "",
  location: "",
  targetId: "",
  support_id: "",
  targetName: "",
  guardianName: "",
  managerMainId: "",
  managerSubId: "",
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
const consultMiddle = ref([]);
const userList = ref([]);
const placeList = ref([]);
const methods = ref([]);
const consultList = ref([]);
const managerList = ref([]);

//장애유형 대분류 이름으로 변환
const disabilityTypeName = computed(() => {
  if (!form.value.targetId || !form.value.disabilityTypes) return "";

  const codes = String(form.value.disabilityTypes).split(",");

  return codes
    .map((code) => {
      const found = disabilityTypes.value.find(
        (t) => String(t.code).trim() === String(code).trim(),
      );
      return found ? found.description : code;
    })
    .filter(Boolean)
    .join(", ");
});

//장애유형 중분류 이름으로 변환
const consultMiddleNames = computed(() => {
  if (!form.value.consultMiddle) return "";

  const codes = form.value.consultMiddle.split(",");

  return codes
    .map((code) => {
      return consultMiddle.value.find((c) => c.j_Code === code)?.description;
    })
    .filter(Boolean)
    .join(", ");
});

// 정담당자 이름 변환
const managerMainName = computed(() => {
  if (!form.value.targetId) return;

  const targetId = form.value.managerMainId;
  if (!targetId || !managerList.value.length) return "없음";

  const found = managerList.value.find(
    (m) => String(m.I_UserId || m.user_id).trim() === String(targetId).trim(),
  );

  return found ? found.name || found.user_name : "없음";
});

// 부담당자 이름 변환
const managerSubName = computed(() => {
  if (!form.value.targetId) return;

  const targetId = form.value.managerSubId;
  if (!targetId || !managerList.value.length) return "없음";

  const found = managerList.value.find(
    (m) => String(m.I_UserId || m.user_id).trim() === String(targetId).trim(),
  );

  return found ? found.name || found.user_name : "없음";
});

//지원대상자 선택
const handleUserChange = () => {
  const user = userList.value.find(
    (u) => String(u.support_id) === String(form.value.targetId),
  );

  if (user) {
    form.value.targetName = user.support_name;
    form.value.guardianName =
      user.guardian_name || user.guardianName || "정보 없음";
    form.value.support_id = user.support_id;

    form.value.disabilityTypes = user.major || "";
    form.value.consultMiddle = user.middle || "";

    form.value.managerMainId = user.managerMainId || "";
    form.value.managerSubId = user.managerSubId || "";
  } else {
    form.value.targetName = "";
    form.value.guardianName = "";
    form.value.support_id = "";

    form.value.disabilityTypes = "";
    form.value.consultMiddle = "";
    form.value.managerMainId = "";
    form.value.managerSubId = "";
  }
};

//지원대상자 선택 (아이디 기준으로 중복되는 이름 제거)
const uniqueUserList = computed(() => {
  if (!userList.value || !Array.isArray(userList.value)) return [];

  const seen = new Set();

  return userList.value.filter((user) => {
    if (seen.has(user.support_id)) return false;
    seen.add(user.support_id);
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
    console.error(error);
  }
};

//장애유형(대분류)
const fetchDisabilityTypes = async () => {
  try {
    const response = await fetch("/api/consult/disability-types");
    if (!response.ok) throw new Error("네트워크 응답 에러");
    const data = await response.json();
    disabilityTypes.value = Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error(error);
  }
};

//장애유형(중분류)
const fetchConsultMiddle = async () => {
  try {
    const response = await fetch("/api/consult/consultMiddle");
    if (!response.ok) throw new Error("네트워크 응답 에러");
    const data = await response.json();
    consultMiddle.value = data;
  } catch (error) {
    console.error(error);
  }
};

//지원대상자
const fetchUsers = async () => {
  try {
    const response = await fetch("/api/consult/support");

    if (!response.ok) throw new Error("사용자 로드 에러");
    const data = await response.json();

    userList.value = Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error(error);
    userList.value = [];
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
    console.error(error);
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
    console.error(error);
  }
};

//담당자 정/부
const fetchManagersList = async () => {
  try {
    const response = await fetch("/api/consult/manager");
    if (response.ok) {
      const result = await response.json();
      managerList.value = Array.isArray(result) ? result : result.data || [];
    }
  } catch (error) {
    console.error("담당자 로드 에러:", error);
  }
};
onMounted(() => {
  fetchConsultList();
  fetchDisabilityTypes();
  fetchUsers();
  fetchPlaces();
  fetchMethod();
  fetchManagersList();
  fetchConsultMiddle();
});

//취소 버튼 (리셋)
const resetCancel = () => {
  if (confirm("작성 내용을 초기화하시겠습니까?")) {
    form.value = {
      consultDate: "",
      writeDate: "",
      startTime: "",
      endTime: "",
      disabilityTypes: "",
      location: "",
      targetId: "",
      support_id: "",
      targetName: "",
      guardianName: "",
      managerMainId: "",
      managerSubId: "",
      method: "",
      memberId: "",
      details: {
        basic: "",
        content: "",
        needs: "",
        opinion: "",
      },
    };
  }
};

//상담기록 등록
const isPrinted = ref(false);

import { useRouter } from "vue-router";
const router = useRouter();

const now = new Date().toISOString().slice(0, 10);

const consultAdd = async () => {
  try {
    const requiredFields = {
      consultDate: "상담일자",
      writeDate: "작성일자",
      startTime: "시작시간",
      endTime: "종료시간",
      location: "상담장소",
      targetId: "지원대상자",
      method: "상담방법",
    };

    for (const [key, label] of Object.entries(requiredFields)) {
      if (!form.value[key]) {
        alert(`${label}의 정보가 입력되지 않았습니다.`);
        return;
      }
    }

    if (!form.value.managerMainId) {
      alert("정담당자가 없는 대상자는 등록할 수 없습니다.");
      return;
    }

    const currentManagerId = localStorage.getItem("userId") || "SUV0001";

    let data = {
      // counsult_id
      J_ID: currentManagerId,
      I_UserId: form.value.managerMainId,
      support_id: form.value.support_id,

      counsult_date: form.value.consultDate,
      write_date: form.value.writeDate,
      counsult_loc: form.value.location,
      counsult_startTime: form.value.startTime,
      counsult_endTime: form.value.endTime,
      counsult_method: form.value.method,

      counsult_content: form.value.details.basic,
      counsult_content2: form.value.details.content,
      counsult_content3: form.value.details.needs,
      counsult_content4: form.value.details.opinion,

      updated_at: form.value.updatedDate || now,
    };

    console.log("실제 전송 데이터:", data);

    let response = await fetch("/api/consult/consultAdd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("서버 응답 실패");

    const result = await response.json();

    if (result.status === "success") {
      alert("상담 기록이 성공적으로 등록되었습니다.");

      router.push({
        name: "managerConsult",
        params: { no: result.counsult_no },
      });
    } else {
      alert("등록 실패: " + (result.message || "알 수 없는 오류"));
      isPrinted.value = true;
    }
  } catch (err) {
    console.error("등록 중 에러 발생:", err);
    alert("상담기록 등록이 실패하였습니다.");
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
  min-width: 140px;
}

.time-picker-custom::-webkit-calendar-picker-indicator {
  cursor: pointer;
  padding: 5px;
  filter: invert(30%) sepia(10%) saturate(1000%) hue-rotate(90deg);
}

.custom-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}

.p-5 {
  padding-bottom: 300px !important;
}
</style>
