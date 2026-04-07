<template>
  <RoleHeader />

  <main class="content-container mx-auto mt-4 shadow-sm bg-white">
    <div class="content-header p-4 border-bottom text-center">
      <h1 class="main-title m-0">상담기록 조회</h1>
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
                :value="d.counsult_date?.slice(0, 10)"
                class="form-input"
                readonly
              />
              <input
                type="date"
                :value="d.write_date?.slice(0, 10)"
                class="form-input"
                readonly
              />
            </div>
          </div>
          <div class="info-item">
            <label>상담 시간 (시작/종료)</label>
            <div class="d-flex gap-2">
              <input
                type="time"
                :value="d.counsult_startTime?.slice(0, 5)"
                class="form-input time-picker-custom text-center"
                readonly
              />
              <input
                type="time"
                :value="d.counsult_endTime?.slice(0, 5)"
                class="form-input time-picker-custom text-center"
                readonly
              />
            </div>
          </div>
          <div class="info-item">
            <label>장애 유형(대분류)</label>
            <input
              type="text"
              :value="d.dis_major_desc"
              class="form-input bg-light"
              readonly
            />
          </div>
          <div class="info-item">
            <label>장애 유형(중분류)</label>
            <input
              type="text"
              :value="d.dis_middle_desc || ''"
              class="form-input bg-light"
              :placeholder="d.dis_middle_desc ? '' : '정보 없음'"
              readonly
            />
          </div>
          <div class="info-item">
            <label>상담 장소</label>
            <input
              type="text"
              :value="d.counsult_loc"
              class="form-input bg-light"
              readonly
            />
          </div>
          <div class="info-item">
            <label>지원자명</label>
            <input
              type="text"
              :value="d.guardian_name"
              class="form-input bg-light"
              readonly
            />
          </div>
          <div class="info-item">
            <label>보호자명</label>
            <input
              type="text"
              :value="d.user_name"
              class="form-input bg-light"
              placeholder="정보 없음"
              readonly
            />
          </div>
          <div class="info-item">
            <label>상담 방법</label>
            <input
              type="text"
              :value="d.counsult_method"
              class="form-input bg-light"
              readonly
            />
          </div>

          <div class="info-item">
            <label>정담당자</label>
            <input
              type="text"
              :value="d.insti_name"
              class="form-input bg-light"
              placeholder="정보 없음"
              readonly
            />
          </div>
          <div class="info-item">
            <label>부담당자</label>
            <input
              type="text"
              :value="d.insti_sub_name"
              class="form-input bg-light"
              placeholder="정보 없음"
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
            :value="d[item.key]"
            class="record-textarea"
            rows="5"
            placeholder="내용 없음"
            readonly
          ></textarea>
        </div>
      </section>

      <footer class="d-flex justify-content-center gap-3 mt-5 pt-4">
        <RouterLink to="/manager/consult" class="btn-action btn-prev">
          목록으로
        </RouterLink>
      </footer>
    </div>
  </main>
</template>

<script setup>
import RoleHeader from "../components/RoleHeader.vue";
import { ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const selectNo = route.params.no;
const d = ref({});

const sections = ref([
  { title: "기본 정보 요약", key: "counsult_content" },
  { title: "주요 상담 내용", key: "counsult_content2" },
  { title: "서비스 욕구 및 지원 필요성", key: "counsult_content3" },
  { title: "담당자 종합 의견", key: "counsult_content4" },
]);

const consultDetail = async (no) => {
  try {
    const res = await fetch(`/api/consult/user/${no}`);
    const data = await res.json();
    const result = Array.isArray(data) ? data[0] : data;

    if (result) {
      const majorNames = {
        MJ001: "기질성 정신장애",
        MJ002: "정신 및 행동장애",
        MJ003: "조현병 및 망상장애",
        MJ004: "기분 장애",
        MJ005: "신경증성 및 신체형 장애",
        MJ006: "생리 장애 및 행동증후군",
        MJ007: "성인 인격 및 행동의 장애",
        MJ008: "정신지체",
        MJ009: "정신발달장애",
        MJ010: "소아기 및 청소년기 행동 및 정서 장애",
        MJ011: "상세불명의 정신장애",
      };

      let finalMajorDesc = result.dis_major_desc;

      if (!finalMajorDesc && result.major_code) {
        finalMajorDesc = result.major_code
          .split(",")
          .map((code) => {
            const trimmed = code.trim();
            return majorNames[trimmed] || trimmed;
          })
          .join(", ");
      }

      d.value = {
        ...result,
        dis_major_desc: finalMajorDesc || "유형 미정",
        insti_name: result.insti_name || "미지정",
        insti_sub_name: result.insti_sub_name || "미지정",
      };
    }
  } catch (err) {
    console.error("상담 상세 조회 실패:", err);
  }
};

onBeforeMount(() => {
  consultDetail(selectNo);
});
</script>

<style scoped>
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
.btn-action {
  padding: 12px 45px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid transparent;
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
.time-picker-custom {
  cursor: pointer;
  position: relative;
}
.time-picker-custom::-webkit-calendar-picker-indicator {
  cursor: pointer;
  padding: 5px;
}
.p-5 {
  padding-bottom: 300px !important;
}
</style>
