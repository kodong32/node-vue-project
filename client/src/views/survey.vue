<template>
  <div class="d-flex min-vh-100">
    <aside class="sidebar-wrapper">
      <Sidebar />
    </aside>

    <main class="flex-grow-1 main-content-area">
      <RoleHeader />
      <!-- <SurveyCard :ver-id="$route.params.id || 'FORM0004'" /> -->
      <SurveyCard />
    </main>
  </div>
</template>

<script setup>
import RoleHeader from "./components/RoleHeader.vue";
import SurveyCard from "./components/surveyCard.vue";
import Sidebar from "../examples/Sidenav/SidenavList.vue";
</script>

<style scoped>
.sidebar-wrapper {
  width: 250px;
  min-width: 250px;
  height: 100vh;
  position: sticky;
  top: 0;
}

.main-content-area {
  background-color: #f8f9fa;
  overflow-x: hidden;
}
</style>
