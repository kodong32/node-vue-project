<script setup>
import { computed } from "vue";

// 💡 부모(UserMain)로부터 받을 데이터 (전체 개수, 한 페이지 개수, 현재 페이지)
const props = defineProps({
  totalCount: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    default: 10,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

// 💡 부모에게 "이 페이지 번호 눌렀어요!"라고 알려줄 이벤트
const emit = defineEmits(["page-change"]);

// 🧮 총 페이지 수 계산 (예: 45 / 10 = 4.5 -> 올림해서 5페이지)
const totalPages = computed(() => {
  return Math.ceil(props.totalCount / props.limit) || 1;
});

// 번호 버튼이나 이전/다음 버튼을 눌렀을 때 실행
const changePage = (page) => {
  // 1페이지보다 작아지거나, 끝 페이지보다 커지는 걸 방지!
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit("page-change", page);
  }
};
</script>

<template>
  <ul class="pagination pagination-success justify-content-center mt-4">
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <a
        class="page-link"
        href="javascript:;"
        @click="changePage(currentPage - 1)"
      >
        <i class="fa fa-angle-left"></i>
      </a>
    </li>

    <li
      class="page-item"
      v-for="page in totalPages"
      :key="page"
      :class="{ active: page === currentPage }"
    >
      <a class="page-link" href="javascript:;" @click="changePage(page)">
        {{ page }}
      </a>
    </li>

    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <a
        class="page-link"
        href="javascript:;"
        @click="changePage(currentPage + 1)"
      >
        <i class="fa fa-angle-right"></i>
      </a>
    </li>
  </ul>
</template>
