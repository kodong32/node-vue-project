<script setup>
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["select"]);
</script>

<template>
  <div class="card h-100 rounded-0 shadow-none border-0">
    <div class="card-header border-bottom bg-white">
      <h4 class="mb-0 fw-bold">담당 지원 대상자 목록</h4>
    </div>

    <div class="card-body p-0">
      <div v-if="list.length === 0" class="empty-box">
        조회된 대상자가 없습니다.
      </div>

      <div v-else class="table-responsive">
        <table class="table align-items-center mb-0 support-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>담당구분</th>
              <th class="text-center">비고</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.support_id">
              <td>{{ item.support_name || "-" }}</td>
              <td>{{ item.chargeType || "-" }}</td>
              <td class="text-center">
                <button
                  type="button"
                  class="btn btn-sm bg-gradient-primary mb-0"
                  @click="$emit('select', item)"
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

<style scoped>
.empty-box {
  padding: 40px 20px;
  text-align: center;
  color: #8392ab;
  font-size: 14px;
}

.support-table th,
.support-table td {
  vertical-align: middle;
  padding: 0.75rem 1rem;
}
</style>