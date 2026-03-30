<template>
  <div class="container-fluid">
    <div class="page-header min-height-100">
      <span class="mask bg-gradient-success opacity-6"></span>
    </div>

    <div class="card shadow-lg mt-n6">
      <div class="card-body p-3 position-relative">
        <div class="row gx-4">
          <div class="col-auto">
            <div class="avatar avatar-xl position-relative">
              <img
                src="@/assets/img/team-1.jpg"
                alt="profile_image"
                class="shadow-sm w-100 border-radius-lg"
              />
            </div>
          </div>

          <div class="col-auto my-auto">
            <div class="h-100">
              <ul class="nav nav-pills custom-top-menu" role="tablist">
                <li class="nav-item">
                  <a class="px-3 py-2 nav-link active" href="javascript:;">
                    <span class="ms-1">첫 화면</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a class="px-3 py-2 nav-link" href="javascript:;">
                    <span class="ms-1">공지사항</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a class="px-3 py-2 nav-link" href="javascript:;">
                    <span class="ms-1">지원 계획서</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a class="px-3 py-2 nav-link" href="javascript:;">
                    <span class="ms-1">지원 결과</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            class="position-absolute top-50 start-50 translate-middle text-center fw-bold"
          >
            {{ userName }}님 환영합니다
          </div>

          <div
            class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0"
          >
            <div class="nav-wrapper position-relative end-0">
              <ul
                class="p-1 bg-transparent nav nav-pills nav-fill"
                role="tablist"
              >
                <li class="nav-item">
                  <a class="px-3 py-2 mb-0 nav-link active" href="javascript:;">
                    <span class="ms-1">My Page</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a class="px-3 py-2 mb-0 nav-link" href="javascript:;">
                    <span class="ms-1">Log Out</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
defineProps({
  userRole: {
    type: String,
    required: true,
    default: "USER",
  },
});

import { useAuthStore } from "@/stores/counter";
const userAuthStore = useAuthStore();

const userName = computed(() => userAuthStore.user?.name);
</script>
