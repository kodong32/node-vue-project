<script setup>
import { ref, onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
// import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();

import { useRouter } from "vue-router";
const router = useRouter();

//회원가입으로 이동하는 router(김경환 2026.03.25)
const goSingup = () => {
  router.push("/user/signup");
};

//일반이용자 로그인 페이지로 이동 (김경환 2026.03.25)
const goLog = () => {
  router.push("/user/login");
};

//회원가입으로 생성한 계정으로 로그인 시도(김경환 2026.03.25)
import { useInstiAuthStore } from "@/stores/counter";
const authStore = useInstiAuthStore();
const loginId = ref("");
const loginPw = ref("");
const goMain = async () => {
  // 스토어의 login 함수 호출
  const isSuccess = await authStore.login(loginId.value, loginPw.value);

  if (isSuccess) {
    alert(`${authStore.user.name}님, 환영합니다!`); // DB에서 가져온 이름 활용
    console.log("role:", authStore.roll);
    if (authStore.user.roll === "a002") {
      router.push("/general"); // 기관 관리자 메인 페이지로 이동
    } else {
      router.push("/manager"); // 기관 담당자 메인 페이지로 이동
    }
  } else {
    alert("아이디 또는 비밀번호가 올바르지 않습니다.");
  }
};
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-auto ms-lg-0 me-lg-auto"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <div class="row px-xl-7 px-sm-8 px-8">
                    <div
                      class="mt-auto p-3 d-flex justify-content-center gap-3"
                    >
                      <div class="col-auto">
                        <argon-button color="dark" @click="goLog()"
                          >일반이용자</argon-button
                        >
                      </div>
                      <div class="col-auto">
                        <argon-button>기관직원</argon-button>
                      </div>
                    </div>
                  </div>
                  <h4 class="font-weight-bolder">기관 로그인</h4>
                  <p class="mb-0">기관 소속 전용 로그인 페이지입니다.</p>
                </div>
                <div class="card-body">
                  <form role="form">
                    <div class="mb-3">
                      <argon-input
                        id="id"
                        type="text"
                        placeholder="아이디"
                        name="id"
                        size="lg"
                        v-model="loginId"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="비밀번호"
                        name="password"
                        size="lg"
                        v-model="loginPw"
                      />
                    </div>
                    <!-- <argon-switch id="rememberMe" name="remember-me"
                      >Remember me</argon-switch
                    > -->

                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        @click.prevent="goMain()"
                        >로그인</argon-button
                      >
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    아이디 / 비밀번호를 잊어버리셨나요?
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      >아이디 찾기</a
                    >
                    |
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      >비밀번호 찾기</a
                    >
                  </p>
                </div>

                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    회원이 아닌가요?
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      @click="goSingup()"
                      >회원가입</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg&quot;);
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  발달장애인 지원 프로그램
                </h4>
                <p class="text-white position-relative">
                  이곳은 기관 소속 전용 로그인 페이지입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
