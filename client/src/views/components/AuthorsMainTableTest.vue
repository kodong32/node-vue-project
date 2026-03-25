<script setup>
import { defineProps } from "vue";

// 💡 부모 컴포넌트에서 던져줄 데이터(surveyList)와 권한(userRole)을 받을 바구니 준비!
const props = defineProps({
  surveyList: {
    type: Array,
    required: true,
    default: () => [], // 만약 데이터가 안 오면 빈 배열로 에러 방지
  },
  userRole: {
    type: String,
    required: true, // "USER", "MANAGER", "ADMIN" 중 하나가 들어올 예정
  },
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
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
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
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in props.surveyList"
              :key="item.surveyId || index"
            >
              <td class="align-middle text-center">
                <h6 class="mb-0 text-sm">{{ item.supportName }}</h6>
              </td>

              <td class="align-middle text-center">
                <p class="text-xs font-weight-bold mb-0">
                  {{ item.generalName }}
                </p>
              </td>

              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{
                  item.registerDate
                }}</span>
              </td>

              <td class="align-middle text-center">
                <button
                  class="btn btn-primary btn-sm mb-0 px-3 py-1"
                  @click="$router.push(`/survey/detail/${item.surveyId}`)"
                >
                  보기
                </button>
              </td>

              <td class="align-middle text-center">
                <p class="text-xs font-weight-bold mb-0">
                  <button
                    v-if="props.userRole === 'GENERAL' && !item.instiName"
                    class="badge bg-gradient-warning border-0"
                  >
                    배정
                  </button>
                  <span v-else>{{ item.instiName || "미배정" }}</span>
                </p>
              </td>

              <td class="align-middle text-center text-sm">
                <span class="badge badge-sm bg-gradient-success">{{
                  item.priorityName || item.priorityCode
                }}</span>
              </td>

              <td class="align-middle text-center text-xs">
                검토 {{ item.reviewCount }}건 <br />
                계획 {{ item.planCount }}건 <br />
                반려 {{ item.rejectCount }}건 <br />
                종료 {{ item.finishCount }}건
              </td>

              <td class="align-middle text-center">
                <button
                  class="btn btn-sm mb-0 px-3 py-1"
                  :class="item.hasPlan ? 'btn-info' : 'btn-outline-secondary'"
                  :disabled="!item.hasPlan"
                >
                  보기
                </button>
              </td>

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
