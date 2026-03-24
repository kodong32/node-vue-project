<!-- AuthorsMainTableTest.vue -->
<script setup>
import { ref, onMounted } from "vue";
// import Sidebar from "../examples/Sidenav/MainSidenav.vue";
import axios from "axios";

// 백엔드에서 받아올 조사지 리스트를 담을 바구니
const surveyList = ref([]);

// 화면이 열릴 때 백엔드에 데이터 요청
onMounted(async () => {
  try {
    // 💡 백엔드 서버 주소와 포트, 유저 ID를 네 설정에 맞게 찌름
    const response = await axios.get("http://localhost:3000/main/GUSR0000");

    // 데이터가 무사히 오면 바구니에 담기 (Vue가 알아서 표를 그려줌!)
    // 만약 DB 구조 분해 할당 이슈 때문에 response.data가 배열이 아니라 단일 객체라면
    // [response.data] 처럼 배열로 감싸주면 에러 없이 출력돼!
    surveyList.value = Array.isArray(response.data)
      ? response.data
      : [response.data];

    console.log("🔥 데이터 렌더링 완료:", surveyList.value);
  } catch (error) {
    console.error("데이터를 가져오는 중 에러 발생:", error);
  }
});
</script>
<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>조사지 내역</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                번호
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                지원자명
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                보호자명
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                지원신청일
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                조사지
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                담당자
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                우선순위
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                진행상태
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                지원계획
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                지원결과
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in surveyList"
              :key="item.surveyId || index"
            >
              <!-- 글번호 -->
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{
                  surveyList.length - index
                }}</span>
              </td>

              <!-- 지원자명 -->
              <td class="align-middle text-center">
                <h6 class="mb-0 text-sm">{{ item.supportName }}</h6>
              </td>

              <!-- 보호자명 -->
              <td class="align-middle text-center">
                <p class="text-xs font-weight-bold mb-0">
                  {{ item.generalName }}
                </p>
              </td>

              <!-- 지원신청일 -->
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ item.registerDate }}
                </span>
              </td>

              <!-- 조사지 -->
              <td class="align-middle text-center">
                <button class="btn btn-primary btn-sm mb-0 px-3 py-1">
                  보기
                </button>
              </td>

              <!-- 담당자 -->
              <td class="align-middle text-center">
                <p class="text-xs font-weight-bold mb-0">
                  {{ item.instiName }}
                </p>
              </td>

              <!-- 우선순위 -->
              <td class="align-middle text-center text-sm">
                <span class="badge badge-sm bg-gradient-success">
                  {{ item.priorityCode }}
                </span>
              </td>

              <!-- 진행상태 -->
              <td class="align-middle text-center text-xs">
                검토 {{ item.reviewCount }}건 <br />
                계획 {{ item.planCount }}건 <br />
                반려 {{ item.rejectCount }}건 <br />
                종료 {{ item.finishCount }}건
              </td>

              <!-- 지원계획 -->
              <td class="align-middle text-center">
                <button
                  class="btn btn-sm mb-0 px-3 py-1"
                  :class="item.hasPlan ? 'btn-info' : 'btn-outline-secondary'"
                  :disabled="!item.hasPlan"
                >
                  보기
                </button>
              </td>

              <!-- 지원결과 -->
              <td class="align-middle text-center">
                <button
                  class="btn btn-sm mb-0 px-3 py-1"
                  :class="item.hasResult ? 'btn-info' : 'btn-outline-secondary'"
                  :disabled="!item.hasResult"
                >
                  보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
