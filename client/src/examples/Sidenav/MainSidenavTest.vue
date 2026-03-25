<script setup>
import { computed, ref } from "vue"; //계산된 값과 변수를 반응형으로 만듦
import { useRoute } from "vue-router"; //현재 URL 정보를 가져옴
import { useStore } from "vuex"; //전역 데이터 접근 시 사용

import SidenavItem from "./SidenavItem.vue";
import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const route = useRoute();
const isRTL = computed(() => store.state.isRTL);
//RTL(오른쪽 → 왼쪽 레이아웃) 여부 ????????????
// 👉 store에 있는 값을 가져와서 반응형으로 사용

// 현재 경로가 설문 추가 페이지인지 확인 (라우트 이름 또는 경로 포함 여부 체크)
const isSurveyPage = computed(() => {
  return route.name === "userSurveyAdd" || route.path.includes("userSurveyAdd");
});
//route.name === "userSurveyAdd" 👉 라우트 이름으로 확인
// route.path.includes("userSurveyAdd") 👉 URL에 해당 문자열 포함되어 있는지 확인
// 👉 둘 중 하나라도 맞으면 true

const getRoute = () => {
  const routeArr = route.path.split("/");
  return routeArr[1];
};
//👉 현재 URL을 / 기준으로 쪼개서 첫 번째 경로 가져오기 ["", "user", "survey", "add"]
//👉 routeArr[1] → "user"

// 인풋 데이터 정의
const applicantName = ref("홍길동");
const largeCategory = ref("");
const mediumCategory = ref("");
const smallCategory = ref("");
const gender = ref("");
const birthDate = ref("");
</script>

<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <template v-if="isSurveyPage">
        <li class="nav-item ps-4 pt-4">
          <h5 class="font-weight-bolder text-dark mb-4">지원자 정보 입력</h5>

          <div class="mb-3 me-3">
            <label class="form-label text-sm font-weight-bold text-secondary"
              >지원자명</label
            >
            <select
              v-model="applicantName"
              class="form-select border custom-input"
            >
              <option value="홍길동">홍길동</option>
              <option value="김철수">김철수</option>
              <option value="이영희">이영희</option>
            </select>
          </div>

          <hr class="horizontal dark mt-4 mb-4 me-3" />

          <div class="mb-3 me-3">
            <label
              class="form-label text-sm font-weight-bold text-secondary mb-2"
              >장애유형</label
            >
            <input
              type="text"
              v-model="largeCategory"
              class="form-control border custom-input mb-2"
              placeholder="대분류 입력"
            />
            <input
              type="text"
              v-model="mediumCategory"
              class="form-control border custom-input mb-2"
              placeholder="중분류 입력"
            />
            <input
              type="text"
              v-model="smallCategory"
              class="form-control border custom-input"
              placeholder="소분류 입력"
            />
          </div>

          <hr class="horizontal dark mt-4 mb-4 me-3" />

          <div class="d-flex mb-3 me-3">
            <div class="w-45 me-3">
              <label class="form-label text-sm font-weight-bold text-secondary"
                >성별</label
              >
              <input
                type="text"
                v-model="gender"
                class="form-control border custom-input text-center"
                placeholder="남/여"
              />
            </div>
            <div class="flex-fill">
              <label class="form-label text-sm font-weight-bold text-secondary"
                >생년월일</label
              >
              <input
                type="text"
                v-model="birthDate"
                class="form-control border custom-input text-center"
                placeholder="YY.MM.DD"
              />
            </div>
          </div>
        </li>
      </template>

      <template v-else>
        <li class="nav-item">
          <sidenav-item
            to="/user/surveyadd"
            :class="getRoute() === '/user/surveyadd' ? 'active' : ''"
            :navText="isRTL ? 'لوحة القيادة' : 'Dashboard'"
          >
            <template v-slot:icon>
              <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>
      </template>
    </ul>
  </div>

  <div v-if="!isSurveyPage" class="pt-3 mx-3 mt-3 sidenav-footer">
    <sidenav-card
      :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'Documentation',
            route:
              'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
        ],
      }"
    />
  </div>
</template>

<style scoped>
/* 입력창이 확실히 보이도록 하는 스타일 */
.custom-input {
  display: block !important;
  width: 100% !important;
  background-color: #ffffff !important;
  border: 1px solid #d2d6da !important;
  border-radius: 8px !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 0.875rem !important;
}

.custom-input:focus {
  border-color: #5e72e4 !important;
  box-shadow: 0 0 0 2px rgba(94, 114, 228, 0.2) !important;
  outline: none !important;
}

.text-center {
  text-align: center !important;
}

.w-45 {
  width: 45% !important;
}

.horizontal.dark {
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0)
  );
  height: 1px;
  border: 0;
  margin: 1rem 0;
}

/* 스크롤바 설정 */
.navbar-collapse {
  overflow-y: auto !important;
}
</style>
