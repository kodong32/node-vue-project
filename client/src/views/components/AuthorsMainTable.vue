<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const goToPlan = (surveyId) => {
  if (props.userRole === "USER") {
    // 1. 일반 이용자: 승인된 계획서만 보는 전용 상세 페이지로!
    router.push(`/user/plan/detail/${surveyId}`);
  } else if (props.userRole === "MANAGER") {
    // 2. 기관 담당자: 담당자용 리스트/상세 페이지로! (아직 안 만들었지만 주소는 뚫어놓자)
    router.push(`/manager/plan?surveyId=${surveyId}`);
  } else if (props.userRole === "GENERAL") {
    // 3. 기관 관리자: 방금 우리가 예쁘게 만든 그 리스트 페이지로 이동!
    // 팁: surveyId를 쿼리로 달고 가면, 그 페이지에서 해당 조사지만 쏙 필터링할 수 있어!
    router.push(`/general/plan?surveyId=${surveyId}`);
  }
};

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
  totalCount: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
});

const goManager = () => {
  //하드코딩상태
  router.push("/general/select-manager/SUV0057");
};
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
                번호
              </th>
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
              <!-- 번호 -->
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{
                    props.totalCount -
                    (props.currentPage - 1) * props.limit -
                    index
                  }}
                </span>
              </td>

              <!-- 지원대상자 -->
              <td class="align-middle text-center">
                <h6 class="mb-0 text-sm">{{ item.supportName }}</h6>
              </td>

              <!-- 보호자 -->
              <td class="align-middle text-center">
                <p class="text-xs font-weight-bold mb-0">
                  {{ item.generalName }}
                </p>
              </td>

              <!-- 등록일 -->
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{
                  item.registerDate
                }}</span>
              </td>

              <!-- 조사지 -->
              <td class="align-middle text-center">
                <button
                  class="btn btn-primary btn-sm mb-0 px-3 py-1"
                  @click="$router.push(`/survey/detail/${item.surveyId}`)"
                >
                  보기
                </button>
              </td>

              <!-- 담당자 -->
              <td class="align-middle text-center">
                <p class="text-xs font-weight-bold mb-0">
                  <button
                    v-if="props.userRole === 'GENERAL' && !item.instiName"
                    class="badge bg-gradient-warning border-0"
                    @click="goManager()"
                  >
                    배정
                  </button>
                  <span v-else>{{ item.instiName || "미배정" }}</span>
                </p>
              </td>

              <!-- 우선순위 -->
              <td class="align-middle text-center text-sm">
                <button
                  v-if="
                    props.userRole === 'GENERAL' &&
                    item.priorityCode === '심사중'
                  "
                  class="btn btn-sm btn-warning mb-0 px-3 py-1"
                  @click="
                    $router.push(`/general/priority-approval/${item.surveyId}`)
                  "
                >
                  심사
                </button>

                <button
                  v-else-if="
                    props.userRole === 'MANAGER' && item.priorityCode === '미정'
                  "
                  class="btn btn-sm btn-outline-warning mb-0 px-3 py-1"
                  @click="
                    $router.push(`/manager/priority-request/${item.surveyId}`)
                  "
                >
                  요청
                </button>

                <button
                  v-else-if="
                    props.userRole === 'MANAGER' && item.priorityCode === '반려'
                  "
                  class="btn btn-sm btn-danger mb-0 px-3 py-1"
                  @click="
                    $router.push(`/manager/priority-request/${item.surveyId}`)
                  "
                >
                  반려
                </button>

                <span
                  v-else
                  class="badge badge-sm"
                  :class="{
                    'bg-gradient-danger':
                      item.priorityCode === '긴급' ||
                      item.priorityCode === '반려',
                    'bg-gradient-success': item.priorityCode === '중점',
                    'bg-gradient-info': item.priorityCode === '계획',
                    'bg-gradient-secondary':
                      item.priorityCode === '심사중' ||
                      item.priorityCode === '미정',
                  }"
                >
                  {{ item.priorityCode }}
                </span>
              </td>

              <!-- 진행상태 -->
              <td class="align-middle text-center text-xs">
                검토 {{ item.reviewCount }}건 <br />
                계획 {{ item.planCount }}건 <br />
                <span
                  :class="{
                    'text-danger font-weight-bold': item.rejectCount > 0,
                  }"
                  >반려 {{ item.rejectCount }}건</span
                >
                <br />
                종료 {{ item.finishCount }}건
              </td>

              <!-- 지원계획 -->
              <td class="align-middle text-center">
                <button
                  class="btn btn-sm mb-0 px-3 py-1"
                  :class="item.hasPlan ? 'btn-info' : 'btn-outline-secondary'"
                  :disabled="!item.hasPlan"
                  @click="goToPlan(item.surveyId)"
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
