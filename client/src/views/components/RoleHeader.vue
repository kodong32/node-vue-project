<template>
  <div class="container-fluid">
    <div class="page-header min-height-100">
      <span class="mask bg-gradient-success opacity-6"></span>
    </div>

    <div class="card shadow-lg mt-n6">
      <div class="card-body p-3 header-body">
        <div class="header-wrap">
          <!-- 왼쪽 -->
          <div class="header-left">
            <div class="avatar avatar-xl position-relative flex-shrink-0">
              <img
                src="@/assets/img/2조로고.png"
                alt="profile_image"
                class="shadow-sm w-100 border-radius-lg"
              />
            </div>

            <div class="header-menu-wrap">
              <ul class="nav nav-pills custom-top-menu flex-nowrap">
                <!-- 첫화면 -->
                <li class="nav-item">
                  <button
                    type="button"
                    class="px-3 py-2 nav-link active border-0 bg-transparent"
                    @click="goHome"
                  >
                    <span class="ms-1">첫화면</span>
                  </button>
                </li>

                <!-- 공지사항 -->
                <li class="nav-item">
                  <button
                    type="button"
                    class="px-3 py-2 nav-link border-0 bg-transparent"
                    @click="goNotice"
                  >
                    <span class="ms-1">공지사항</span>
                  </button>
                </li>

                <!-- 기관 관리자 전용 메뉴 -->
                <template v-if="userRole === ROLE.ADMIN">
                  <li class="nav-item">
                    <button
                      type="button"
                      class="px-3 py-2 nav-link border-0 bg-transparent"
                      @click="goPlan"
                    >
                      <span class="ms-1">지원계획서</span>
                    </button>
                  </li>

                  <li class="nav-item">
                    <button
                      type="button"
                      class="px-3 py-2 nav-link border-0 bg-transparent"
                      @click="goResult"
                    >
                      <span class="ms-1">지원결과</span>
                    </button>
                  </li>

                  <li class="nav-item">
                    <button
                      type="button"
                      class="px-3 py-2 nav-link border-0 bg-transparent"
                      @click="goManager"
                    >
                      <span class="ms-1">기관담당자</span>
                    </button>
                  </li>
                </template>

                <!-- 기관 담당자 전용 메뉴 -->
                <template v-else-if="userRole === ROLE.MANAGER">
                  <li class="nav-item">
                    <button
                      type="button"
                      class="px-3 py-2 nav-link border-0 bg-transparent"
                      @click="goPlan"
                    >
                      <span class="ms-1">지원계획서</span>
                    </button>
                  </li>

                  <li class="nav-item">
                    <button
                      type="button"
                      class="px-3 py-2 nav-link border-0 bg-transparent"
                      @click="goResult"
                    >
                      <span class="ms-1">지원 결과서</span>
                    </button>
                  </li>

                  <li class="nav-item">
                    <button
                      type="button"
                      class="px-3 py-2 nav-link border-0 bg-transparent"
                      @click="goConsult"
                    >
                      <span class="ms-1">상담기록</span>
                    </button>
                  </li>

                  <li class="nav-item">
                    <button
                      type="button"
                      class="px-3 py-2 nav-link border-0 bg-transparent"
                      @click="goHistory"
                    >
                      <span class="ms-1">히스토리</span>
                    </button>
                  </li>
                </template>

                <!-- 일반 사용자 전용 메뉴 -->
                <template v-else-if="userRole === ROLE.USER">
                  <li class="nav-item">
                    <button
                      type="button"
                      class="px-3 py-2 nav-link border-0 bg-transparent"
                      @click="goHistory"
                    >
                      <span class="ms-1">히스토리</span>
                    </button>
                  </li>
                </template>
              </ul>
            </div>
          </div>

          <!-- 가운데 -->
          <div class="header-center">
            {{ welcomeText }}
          </div>

          <!-- 오른쪽 -->
          <div class="header-right">
            <div class="nav-wrapper position-relative end-0">
              <ul class="p-1 bg-transparent nav nav-pills nav-fill flex-nowrap">
                <!-- My Page -->
                <li class="nav-item" v-if="isLogin">
                  <button
                    type="button"
                    class="px-3 py-2 mb-0 nav-link active border-0 bg-transparent"
                    @click="goMyPage"
                  >
                    <span class="ms-1">My Page</span>
                  </button>
                </li>

                <!-- 로그아웃 -->
                <li class="nav-item" v-if="isLogin">
                  <button
                    type="button"
                    class="px-3 py-2 mb-0 nav-link border-0 bg-transparent"
                    @click="logout"
                  >
                    <span class="ms-1">Log Out</span>
                  </button>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const ROLE = {
  ADMIN: "a002",   // 기관 관리자
  MANAGER: "a003", // 기관 담당자
  USER: "a004",    // 일반 이용자
};

const isLogin = ref(false);
const userType = ref("");
const userName = ref("");
const userRole = ref("");
const loginId = ref("");
const institutionId = ref("");
const userId = ref("");

const getRoleName = (role) => {
  const roleNames = {
    a002: "기관 관리자",
    a003: "기관 담당자",
    a004: "일반 이용자",
  };
  return roleNames[role] || "";
};

const welcomeText = computed(() => {
  if (!isLogin.value) return "";
  return `${userName.value}님 환영합니다 (${getRoleName(userRole.value)})`;
});

const resetLoginState = () => {
  isLogin.value = false;
  userType.value = "";
  userName.value = "";
  userRole.value = "";
  loginId.value = "";
  institutionId.value = "";
  userId.value = "";
};

const getLoginUser = async () => {
  try {
    const result = await fetch("/api/user/auth/me", {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());

    console.log("auth/me result :", result);

    if (result.success && result.isLogin && result.user) {
      isLogin.value = true;
      userType.value = result.userType || "";
      userName.value = result.user.name || "";
      userRole.value = result.user.role || result.user.roll || "";
      loginId.value = result.user.loginId || "";
      institutionId.value =
        result.user.institutionId || result.user.institution_id || "";
      userId.value = result.user.userId || "";
    } else {
      resetLoginState();
    }
  } catch (err) {
    console.log(err);
    resetLoginState();
  }
};

const goHome = () => {
  if (userRole.value === ROLE.ADMIN) {
    router.push("/general");
    return;
  }

  if (userType.value === "INST") {
    router.push("/manager");
    return;
  }

  if (userType.value === "USER") {
    router.push("/user");
    return;
  }

  router.push("/");
};

const goNotice = () => {
  // router.push("/notice");
};

const goPlan = () => {
  if (userRole.value === ROLE.ADMIN) {
    router.push("/general/planlist");
    return;
  }

  router.push("/manager/planlist");
};

const goResult = () => {
  if (userRole.value === ROLE.ADMIN) {
    router.push("/general/result");
    return;
  }

  router.push("/manager/result");
};

const goManager = () => {
  if (!institutionId.value) {
    alert("기관 정보가 없습니다.");
    return;
  }

  router.push({
    path: "/general/managerInfo",
    query: {
      institutionId: institutionId.value,
    },
  });
};

const goConsult = () => {
  router.push("/manager/consult");
};

const goHistory = () => {
  if (userType.value === "INST") {
    // router.push("/manager/history");
    return;
  }

  if (userType.value === "USER") {
    // router.push("/user/history");
    return;
  }
};

const goMyPage = () => {
  if (!loginId.value) {
    alert("로그인 아이디 없음");
    return;
  }

  if (userRole.value === ROLE.ADMIN) {
    router.push(`/general/${loginId.value}/mypage`);
    return;
  }

  if (userType.value === "INST") {
    router.push(`/manager/${loginId.value}/mypage`);
    return;
  }

  if (userType.value === "USER") {
    router.push(`/${loginId.value}/mypage/support`);
  }
};

const getLogoutUrl = () => {
  if (userType.value === "USER") return "/api/user/logout";
  if (userType.value === "INST") return "/api/user/ilogout";
  return "";
};

const logout = async () => {
  try {
    const url = getLogoutUrl();

    if (!url) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const result = await fetch(url, {
      method: "POST",
      credentials: "include",
    }).then((res) => res.json());

    if (result.status === "Success" || result.status === "success") {
      resetLoginState();
      router.push("/user/login");
    } else {
      alert("로그아웃 실패");
    }
  } catch (err) {
    console.log(err);
    alert("로그아웃 오류");
  }
};

onMounted(() => {
  getLoginUser();
});
</script>

<style scoped>
.header-body {
  overflow: hidden;
}

.header-wrap {
  display: grid;
  grid-template-columns: auto minmax(220px, 1fr) auto;
  align-items: center;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.header-menu-wrap {
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.header-menu-wrap::-webkit-scrollbar {
  height: 6px;
}

.header-center {
  min-width: 0;
  text-align: center;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  min-width: 0;
}

@media (max-width: 1200px) {
  .header-wrap {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .header-left {
    flex-wrap: wrap;
  }

  .header-center {
    text-align: left;
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }

  .header-right {
    justify-self: start;
  }
}
</style>