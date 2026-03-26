<script setup>
import { ref, onBeforeMount } from "vue";

const versionList = ref([]);

// 목록 조회
const getVersionList = async () => {
  const result = await fetch(`/api/admin/surveyList`)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
  if (result.status == "Success") {
    versionList.value = result.list;
  } else {
    versionList.value = [];
  }
};

// 버전 변경
const changeVersion = async (verId) => {
  if (!confirm("이 버전을 사용하시겠습니까?")){ return } ;
  
  try{
    const result = await fetch(`/api/admin/surveyActive/${verId}`,{
      method : "put",
    })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

    if(result.status == "Success"){
      alert("버전이 변경되었습니다.");
      await getVersionList();
    }else{
      alert("버전 변경 실패!");
    }
  }catch (err) {
    console.log(err);
    alert("알 수 없는 오류 발생");
  }
};

onBeforeMount(() => {
  getVersionList();
});
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Authors table</h6>
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
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in versionList" :key="item.Ver_Id">
              <!-- 버전ID -->
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <!--<h6 class="mb-0 text-sm">{{ item.Ver_Id }}</h6>--->
                    <p class="text-xs font-weight-bold mb-0">{{ item.version }}</p>
                  </div>
                </div>
              </td>

              <!-- 설명 -->
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ item.description }}</p>
              </td>

              <!-- 상태 -->
              <td class="align-middle text-center text-sm">
                <span
                  v-if="item.use_yn === 'Y'"
                  class="badge badge-sm bg-gradient-success"
                >
                  사용중
                </span>

                <span v-else class="badge badge-sm bg-gradient-secondary"> 미사용 </span>
              </td>

              <!-- 생성일 -->
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ item.created_at }}
                </span>
              </td>

              <!-- 버튼 -->
              <td class="align-middle text-center">
                <button
                  v-if="item.use_yn !== 'Y'"
                  class="btn btn-sm btn-primary"
                  @click="changeVersion(item.Ver_Id)"
                >
                  사용
                </button>

                <span v-else class="text-success text-xs font-weight-bold">
                  현재 사용중
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
