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
                  <a class="px-3 py-2 nav-link active" href="javascript:;"
                    ><span class="ms-1">첫화면</span></a
                  >
                </li>

                <li class="nav-item">
                  <a class="px-3 py-2 nav-link" href="javascript:;"
                    ><span class="ms-1">공지사항</span></a
                  >
                </li>

                <template v-if="userRole === 'GENERAL'">
                  <li class="nav-item">
                    <a class="px-3 py-2 nav-link" href="javascript:;"
                      ><span class="ms-1">담당자관리</span></a
                    >
                  </li>
                </template>

                <template
                  v-if="userRole === 'MANAGER' || userRole === 'GENERAL'"
                >
                  <li class="nav-item">
                    <a class="px-3 py-2 nav-link" href="javascript:;"
                      ><span class="ms-1">지원계획서</span></a
                    >
                  </li>
                  <li class="nav-item">
                    <a class="px-3 py-2 nav-link" href="javascript:;"
                      ><span class="ms-1">지원결과서</span></a
                    >
                  </li>
                  <li class="nav-item">
                    <a class="px-3 py-2 nav-link" href="javascript:;"
                      ><span class="ms-1">상담기록</span></a
                    >
                  </li>
                </template>

                <li class="nav-item">
                  <a class="px-3 py-2 nav-link" href="javascript:;"
                    ><span class="ms-1">히스토리</span></a
                  >
                </li>
              </ul>
            </div>
          </div>

          <div
            class="position-absolute top-50 start-50 translate-middle text-center fw-bold"
          >
            {{ instiName }}님 환영합니다 ({{ getRoleName(userRole) }})
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
                  <a class="px-3 py-2 mb-0 nav-link active" href="javascript:;"
                    ><span class="ms-1">My Page</span></a
                  >
                </li>
                <li class="nav-item" v-if="userRole === 'GENERAL'">
                  <a
                    class="px-3 py-2 mb-0 nav-link active"
                    @click="goApproval()"
                    ><span class="ms-1">가입 승인</span></a
                  >
                </li>

                <li class="nav-item">
                  <a class="px-3 py-2 mb-0 nav-link" href="javascript:;"
                    ><span class="ms-1">Log Out</span></a
                  >
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
import { useRouter } from "vue-router";
const router = useRouter();

// 💡 부모(페이지)한테서 역할이랑 이름을 받아올 바구니 준비!
defineProps({
  userRole: {
    type: String,
    required: true,
    default: "USER", // 🚨 지금은 UserMain 테스트니까 기본값을 USER로!
  },
  // userName: {
  //   type: String,
  //   default: "고동현", // 나중에 로그인한 사람 이름으로 바꿀 거야
  // },
});

// 💡 역할 코드(USER)를 한글 이름(일반이용자)으로 바꿔주는 똑똑한 함수!
const getRoleName = (role) => {
  const roleNames = {
    USER: "일반이용자",
    MANAGER: "기관담당자",
    GENERAL: "기관관리자",
  };
  return roleNames[role] || "";
};

//사용자 이름 (김경환 20260327)
import { useInstiAuthStore } from "@/stores/counter";
const instiAuthStore = useInstiAuthStore();
// const generalAuthStore = useAuthStore();

const instiName = computed(() => instiAuthStore.user?.name);
// const generalName = computed(() => generalAuthStore.user.name);
// const usersRole = computed(() => authStore.user?.roll);

const goApproval = () => {
  router.push("/general/approval");
};
</script>
