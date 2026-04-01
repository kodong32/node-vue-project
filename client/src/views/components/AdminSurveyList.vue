<script setup>
import { ref, onBeforeMount } from "vue";
import { RouterLink } from "vue-router";

const versionList = ref([]);

// 목록 조회
const getVersionList = async () => {
  const result = await fetch(`/api/admin/surveyList`)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

  if (result?.status === "Success") {
    versionList.value = makeEndDateList(result.list || []);
  } else {
    versionList.value = [];
  }
};

// 종료일 계산
const makeEndDateList = (list) => {
  const sortedList = [...list].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  return sortedList.map((item, index) => {
    const nextItem = sortedList[index + 1];

    return {
      ...item,
      end_at: nextItem ? nextItem.created_at : null,
    };
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

onBeforeMount(() => {
  getVersionList();
});
</script>

<template>
  <div class="card">
    <div class="card-header pb-0 d-flex justify-content-between align-items-center">
      <h6 class="mb-0">조사지 버전 목록</h6>

      <RouterLink to="/admin/surveyinsert" class="btn btn-sm bg-gradient-success mb-0">
        조사지등록
      </RouterLink>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Version
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                설명
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                상태
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                생성일
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                종료일
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in versionList" :key="item.Ver_Id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <p class="text-xs font-weight-bold mb-0">{{ item.version }}</p>
                  </div>
                </div>
              </td>

              <td>
                <RouterLink
                  class="px-3 py-2 nav-link"
                  :to="{
                    name: 'adminSurveyDetail',
                    params: { verId: item.Ver_Id },
                  }"
                  active-class="active"
                >
                  {{ item.description }}
                </RouterLink>
              </td>

              <td class="align-middle text-center text-sm">
                <span
                  v-if="item.use_yn === 'Y'"
                  class="badge badge-sm bg-gradient-success"
                >
                  사용중
                </span>
                <span v-else class="badge badge-sm bg-gradient-secondary"> 미사용 </span>
              </td>

              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ formatDate(item.created_at) }}
                </span>
              </td>

              <td class="align-middle text-center">
                <span
                  v-if="item.use_yn === 'Y'"
                  class="text-success text-xs font-weight-bold"
                >
                  현재 사용중
                </span>

                <span v-else class="text-secondary text-xs font-weight-bold">
                  {{ formatDate(item.end_at) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
