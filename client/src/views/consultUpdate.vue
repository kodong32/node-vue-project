<template>
  <RoleHeader />

  <main class="content-container mx-auto mt-4 shadow-sm bg-white">
    <div class="content-header p-4 border-bottom text-center">
      <h1 class="main-title m-0">상담 기록 수정</h1>
    </div>

    <div class="p-5">
      <section class="mb-5">
        <h4 class="section-title mb-4">기본 정보</h4>
        <div class="info-grid">
          <div class="info-item">
            <label>지원대상자</label>
            <input
              v-model="form.support_name"
              class="form-input bg-light"
              disabled
            />
          </div>
          <div class="info-item">
            <label>보호자명</label>
            <input
              v-model="form.user_name"
              class="form-input bg-light"
              disabled
            />
          </div>
          <div class="info-item">
            <label>장애유형 (대분류)</label>
            <input
              v-model="form.dis_major_desc"
              class="form-input bg-light"
              disabled
            />
          </div>
          <div class="info-item">
            <label>장애유형 (중분류)</label>
            <input
              v-model="form.dis_middle_desc"
              class="form-input bg-light"
              disabled
            />
          </div>

          <div class="info-item">
            <label>상담일자</label>
            <input
              type="date"
              v-model="form.counsult_date"
              class="form-input"
            />
          </div>
          <div class="info-item">
            <label>상담 시간 (시작/종료)</label>
            <div class="d-flex gap-2">
              <input
                type="time"
                v-model="form.counsult_startTime"
                class="form-input text-center"
              />
              <span class="align-self-center">~</span>
              <input
                type="time"
                v-model="form.counsult_endTime"
                class="form-input text-center"
              />
            </div>
          </div>
          <div class="info-item">
            <label>상담 유형</label>
            <select v-model="form.counsult_method" class="form-select">
              <option
                v-for="m in methodList"
                :key="m.counsult_method"
                :value="m.counsult_method"
              >
                {{ m.counsult_method }}
              </option>
            </select>
          </div>
          <div class="info-item">
            <label>상담 장소</label>
            <select v-model="form.counsult_loc" class="form-select">
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
            <label>정담당자</label>
            <input
              v-model="form.manager_name"
              class="form-input bg-light"
              disabled
            />
          </div>
          <div class="info-item">
            <label>부담당자</label>
            <input
              v-model="form.sub_manager_name"
              class="form-input bg-light"
              disabled
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
            v-model="form[item.key]"
            class="record-textarea"
            rows="5"
          ></textarea>
        </div>
      </section>

      <footer class="d-flex justify-content-center gap-3 mt-5 pt-4">
        <button class="btn-prev" @click="goList">이전</button>
        <button class="btn-save" @click="updateConsult">저장</button>
        <button class="btn-cancel" @click="resetForm">취소</button>
      </footer>
    </div>
  </main>
</template>

<script setup>
import RoleHeader from "./components/RoleHeader.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const consultId = route.params.no;

const originalForm = ref({});
const methodList = ref([]);
const placeList = ref([]);

const form = ref({
  counsult_id: consultId,
  counsult_date: "",
  counsult_startTime: "",
  counsult_endTime: "",
  counsult_method: "",
  counsult_loc: "",
  counsult_content: "",
  counsult_content2: "",
  counsult_content3: "",
  counsult_content4: "",
  manager_name: "",
  sub_manager_name: "",
});

const sections = ref([
  { title: "기본 정보 요약", key: "counsult_content" },
  { title: "주요 상담 내용", key: "counsult_content2" },
  { title: "서비스 욕구 및 지원 필요성", key: "counsult_content3" },
  { title: "담당자 종합 의견", key: "counsult_content4" },
]);

// 데이터 불러오기
const fetchDetail = async () => {
  try {
    const resp = await fetch(`/api/consult/user/${consultId}`, {
      credentials: "include",
    });
    if (resp.status === 401) throw new Error("Unauthorized");

    const result = await resp.json();

    const data = Array.isArray(result) ? result[0] : result;
    if (data) {
      form.value = {
        ...data,
        counsult_id: consultId,
        counsult_date: data.counsult_date
          ? data.counsult_date.slice(0, 10)
          : "",
        counsult_startTime: data.counsult_startTime
          ? data.counsult_startTime.slice(0, 5)
          : "",
        counsult_endTime: data.counsult_endTime
          ? data.counsult_endTime.slice(0, 5)
          : "",

        support_name: data.guardian_name || "",
        user_name: data.user_name || "",
        dis_major_desc: data.dis_major_desc || "",
        dis_middle_desc: data.dis_middle_desc || "",

        manager_name: data.insti_name || "",
        sub_manager_name: data.insti_sub_name || "",
      };
      originalForm.value = JSON.parse(JSON.stringify(form.value));
    }
  } catch (err) {
    console.error(err);
  }
};

const updateConsult = async () => {
  if (!confirm("수정하시겠습니까?")) return;
  try {
    const updateData = {
      counsult_date: form.value.counsult_date,
      counsult_startTime: form.value.counsult_startTime,
      counsult_endTime: form.value.counsult_endTime,
      counsult_method: form.value.counsult_method,
      counsult_loc: form.value.counsult_loc,
      counsult_content: form.value.counsult_content,
      counsult_content2: form.value.counsult_content2,
      counsult_content3: form.value.counsult_content3,
      counsult_content4: form.value.counsult_content4,
      counsult_id: consultId,
    };
    const resp = await fetch(`/api/consult/consult/${consultId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updateData),
    });
    if (resp.status === 401) {
      alert("로그인 정보가 없거나 세션이 만료되었습니다.");
      router.push({ name: "Login" });
      return;
    }
    const result = await resp.json();
    if (resp.ok && (result.success || result.affectedRows > 0)) {
      alert("상담기록 수정이 완료했습니다.");
      router.push({ name: "managerConsult" });
    } else {
      alert("수정에 실패했습니다.");
    }
  } catch (err) {
    console.error(err);
  }
};

const goList = () => router.push({ name: "managerConsult" });
const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(originalForm.value));
};

onMounted(async () => {
  await fetchDetail();

  const mResp = await fetch("/api/consult/method", {
    credentials: "include",
  });
  methodList.value = await mResp.json();

  const pResp = await fetch("/api/consult/place", {
    credentials: "include",
  });
  const rawPlace = await pResp.json();

  placeList.value = rawPlace.filter((p) => p.counsult_loc?.trim());
});
</script>

<style scoped>
.content-container {
  max-width: 1000px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
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
  padding-left: 15px;
  position: relative;
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
.form-input,
.form-select {
  width: 100%;
  border: 1px solid #cbd5e1;
  padding: 10px 14px;
  border-radius: 8px;
  outline: none;
}
.bg-light {
  background-color: #f1f5f9 !important;
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
  border-bottom: 1px solid #e2e8f0;
}
.record-textarea {
  width: 100%;
  border: none;
  padding: 15px;
  min-height: 120px;
  outline: none;
}
footer button {
  padding: 12px 35px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  border: 2px solid transparent;
}
.btn-save {
  background: #4a7253;
  color: white;
  border-color: #4a7253;
}
.btn-save:hover {
  background: white;
  color: #4a7253;
}
.btn-prev,
.btn-cancel {
  background: #64748b;
  color: white;
  border-color: #64748b;
}
.btn-prev:hover,
.btn-cancel:hover {
  background: white;
  color: #64748b;
}
</style>
