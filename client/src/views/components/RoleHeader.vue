<!---------------
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
----------------------------->
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
                <li class="nav-item">
                  <a class="px-3 py-2 nav-link active">
                    <span class="ms-1">첫화면</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a class="px-3 py-2 nav-link">
                    <span class="ms-1">공지사항</span>
                  </a>
                </li>

                <template v-if="userRole === ROLE.ADMIN">
                  <li class="nav-item">
                    <a class="px-3 py-2 nav-link">
                      <span class="ms-1">담당자관리</span>
                    </a>
                  </li>
                </template>

                <template
                  v-if="userRole === ROLE.ADMIN || userRole === ROLE.MANAGER"
                >
                  <li class="nav-item">
                    <a class="px-3 py-2 nav-link">
                      <span class="ms-1">지원계획서</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="px-3 py-2 nav-link">
                      <span class="ms-1">지원결과서</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="px-3 py-2 nav-link">
                      <span class="ms-1">상담기록</span>
                    </a>
                  </li>
                </template>

                <li class="nav-item" v-if="isLogin">
                  <a class="px-3 py-2 nav-link">
                    <span class="ms-1">히스토리</span>
                  </a>
                </li>
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
                <li class="nav-item" v-if="isLogin">
                  <a class="px-3 py-2 mb-0 nav-link active">
                    <span class="ms-1">My Page</span>
                  </a>
                </li>

                <li class="nav-item" v-if="userRole === ROLE.ADMIN">
                  <a class="px-3 py-2 mb-0 nav-link active" @click="goApproval">
                    <span class="ms-1">가입 승인</span>
                  </a>
                </li>

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

/* 🔥 ROLE 상수 */
const ROLE = {
  ADMIN: "a002", // 기관관리자
  MANAGER: "a003", // 기관담당자
  USER: "a004", // 일반이용자
};

const isLogin = ref(false);
const userType = ref("");
const userName = ref("");
const userRole = ref("");

/* 역할 이름 변환 */
const getRoleName = (role) => {
  const roleNames = {
    a002: "기관 관리자",
    a003: "기관 담당자",
    a004: "일반 이용자",
  };
  return roleNames[role] || "";
};

/* 환영문 */
const welcomeText = computed(() => {
  if (!isLogin.value) return "";
  return `${userName.value}님 환영합니다 (${getRoleName(userRole.value)})`;
});

/* 로그인 사용자 조회 */
const getLoginUser = async () => {
  try {
    const result = await fetch("/api/user/auth/me", {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());

    if (result.success && result.isLogin && result.user) {
      isLogin.value = true;
      userType.value = result.userType;
      userName.value = result.user.name;
      userRole.value = result.user.role;
    } else {
      isLogin.value = false;
      userType.value = "";
      userName.value = "";
      userRole.value = "";
    }
    console.log("result.userType :", result.userType);
    console.log("result.user.role :", result.user.role);
  } catch (err) {
    console.log(err);
  }
};

/* 페이지 이동 */
const goApproval = () => {
  router.push("/general/approval");
};

const getLogoutUrl = () => {
  if (userType.value === "USER") return "/api/user/logout";
  if (userType.value === "INST") return "/api/user/ilogout";
  return "";
};

/* 로그아웃 */
const logout = async () => {
  try {
    const logoutUrl = getLogoutUrl();
    if (!logoutUrl) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    const result = await fetch(logoutUrl, {
      method: "POST",
      credentials: "include",
    }).then((res) => res.json());

    if (result.status === "Success" || result.status === "success") {
      isLogin.value = false;
      userType.value = "";
      userName.value = "";
      userRole.value = "";
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
