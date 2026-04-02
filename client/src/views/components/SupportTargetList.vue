<script setup>
import ArgonButton from "@/components/ArgonButton.vue";

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  isFormOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["add", "edit"]);

const onEdit = (item) => {
  emit("edit", item);
};
</script>

<template>
  <div class="support-card card h-100 rounded-0 shadow-none border-0">
    <div class="card-header border-bottom bg-white">
      <h5 class="mb-1 fw-bold text-center">지원 대상자 목록</h5>
      <p class="mb-0 text-sm text-secondary text-center">등록된 대상자 확인</p>
    </div>

    <div class="card-body p-0 d-flex flex-column">
      <div v-if="list.length === 0" class="empty-box">
        등록된 대상자가 없습니다.
      </div>

      <template v-else>
        <div
          v-for="item in list"
          :key="item.support_id"
          class="list-row d-flex justify-content-between align-items-center"
        >
          <span class="fw-bold">{{ item.name || "-" }}</span>

          <ArgonButton
            size="sm"
            color="dark"
            class="mb-0"
            @click="onEdit(item)"
          >
            수정
          </ArgonButton>
        </div>
      </template>

      <div class="mt-auto p-3">
        <ArgonButton color="secondary" class="w-100 mb-0" @click="$emit('add')">
          {{ isFormOpen ? "닫기" : "지원 대상자 등록" }}
        </ArgonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.support-card {
  min-height: 640px;
  border-right: 1px solid #dcdfe6 !important;
}

.empty-box {
  padding: 40px 20px;
  text-align: center;
  color: #8392ab;
  font-size: 14px;
}

.list-row {
  min-height: 69px;
  padding: 0 16px;
  border-bottom: 1px solid #e9ecef;
}

@media (max-width: 991px) {
  .support-card {
    min-height: auto;
    border-right: none !important;
    border-bottom: 1px solid #dcdfe6 !important;
  }
}
</style>