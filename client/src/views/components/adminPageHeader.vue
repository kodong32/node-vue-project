<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

/* 🔥 관리자 이름 (나중에 세션으로 교체 가능) */
const adminName = ref("admin");

const welcomeText = computed(() => {
  return `${adminName.value}님 환영합니다`;
});

const logout = async () => {
  try {
    const result = await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    }).then((res) => res.json());

    if (result.status === "Success") {
      alert("로그아웃 완료");
      router.push("/admin/login");
    } else {
      alert("로그아웃 실패");
    }
  } catch (err) {
    console.log(err);
    alert("에러 발생");
  }
};
</script>

<template>
  <div class="container-fluid">
    <div class="page-header min-height-100">
      <span class="mask bg-gradient-success opacity-6"></span>
    </div>

    <div class="card shadow-lg mt-n6">
      <div class="card-body p-3">
        <div class="row align-items-center">
          <!-- 왼쪽 (프로필 + 메뉴) -->
          <div class="col-auto d-flex align-items-center gap-3">
            <!-- 프로필 -->
            <div class="avatar avatar-xl">
              <img
                src="@/assets/img/2조로고.png"
                alt="profile_image"
                class="shadow-sm w-100 border-radius-lg"
              />
            </div>

            <!-- 메뉴 -->
            <ul class="nav nav-pills custom-top-menu flex-nowrap">
              <li class="nav-item">
                <router-link class="px-3 py-2 nav-link" to="/admin">
                  첫화면
                </router-link>
              </li>

              <li class="nav-item">
                <router-link class="px-3 py-2 nav-link" to="/admin/institution">
                  기관관리자
                </router-link>
              </li>

              <li class="nav-item">
                <router-link class="px-3 py-2 nav-link" to="/admin/manager">
                  기관담당자
                </router-link>
              </li>

              <li class="nav-item">
                <router-link class="px-3 py-2 nav-link" to="/admin/surveylist">
                  조사지현황
                </router-link>
              </li>

              <li class="nav-item">
                <router-link class="px-3 py-2 nav-link" to="/notice/list">
                  공지사항
                </router-link>
              </li>
            </ul>
          </div>

          <!-- 🔥 가운데 (이제 안겹침) -->
          <div class="col text-center fw-bold">
            {{ welcomeText }}
          </div>

          <!-- 오른쪽 (로그아웃) -->
          <div class="col-auto">
            <button
              type="button"
              class="px-3 py-2 nav-link border-0 bg-transparent"
              @click="logout"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
