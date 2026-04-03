<script setup>
import { computed, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
const sidebarType = computed(() => store.state.sidebarType);
const darkMode = computed(() => store.state.darkMode);

const sidebarComponentMap = {
  userMain: defineAsyncComponent(() => import("./UserMainSidenav.vue")),
  managerMain: defineAsyncComponent(() => import("./ManagerMainSidenav.vue")),
  generalMain: defineAsyncComponent(() => import("./GeneralMainSidenav.vue")),
};

// 현재 페이지가 사이드바를 사용하는 페이지인지 여부
const hasSidebar = computed(() => {
  return !!route.meta?.sidebar && !!sidebarComponentMap[route.meta.sidebar];
});

const currentSidebarComponent = computed(() => {
  if (!hasSidebar.value) return null;
  return sidebarComponentMap[route.meta.sidebar];
});
</script>

<template>
  <div
    v-show="layout === 'default'"
    class="min-height-300 position-absolute w-100"
    :class="`${darkMode ? 'bg-transparent' : 'bg-success'}`"
  />

  <aside
    v-if="hasSidebar"
    class="border-0 sidenav navbar navbar-vertical navbar-expand-xs custom-sidenav"
    :class="`${isRTL ? 'fixed-end me-3 rotate-caret' : 'fixed-start'} ${
      layout === 'landing' ? 'bg-transparent shadow-none' : ''
    } ${sidebarType}`"
    id="sidenav-main"
  >
    <component :is="currentSidebarComponent" />
  </aside>
</template>

<style scoped>
.custom-sidenav {
  position: fixed !important;
  top: 20px !important;
  left: 20px !important;
  bottom: 20px !important;
  width: 280px !important;
  margin: 0 !important;
  padding: 0 !important;
  background: #ffffff !important;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12) !important;
  border-radius: 18px !important;
  overflow: hidden !important;
  z-index: 1030 !important;
}

.fixed-end.custom-sidenav {
  left: auto !important;
  right: 20px !important;
}

@media (max-width: 1199.98px) {
  .custom-sidenav {
    display: none !important;
  }
}
</style>