<script setup>
//기관이용자 회원가입페이지
import { ref, reactive, onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";

import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();

const instiUserInfo = reactive({
  institution_id: "",
  name: "",
  id: "",
  password: "",
  tel: "",
  roll: "",
});

const isPrinted = ref(false);

import { useRouter } from "vue-router";
const router = useRouter();

//일반이용자 이동 라우터(김경환 2026.03.24)
const goUser = () => {
  router.push("/user/signup");
};

//로그인 페이지로 이동하는 라우터(김경환 2026.03.25)
const goLogin = () => {
  router.push("/user/login");
};

//기관이용자의 정보를 db에 전송시키는 함수(김경환 2026.03.25)
const addInstiUserInfo = async () => {
  let data = {
    institution_id: instiUserInfo.institution_id,
    name: instiUserInfo.name,
    id: instiUserInfo.id,
    password: instiUserInfo.password,
    tel: instiUserInfo.tel,
    roll: instiUserInfo.roll,
  };
  console.log(data);

  let result = await fetch(`/api/user/instiUsers`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  if (result.status == "success") {
    router.push({ name: "userLogin", params: { no: result.I_UserId } });
  } else {
    isPrinted.value = true;
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
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg&quot;);
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">발달장애인 지원 프로그램</h1>
            <p class="text-lead text-white">
              기관 직원용 회원가입 페이지입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>Register with</h5>
            </div>
            <div class="row px-xl-7 px-sm-8 px-8">
              <div class="mt-auto p-3 d-flex justify-content-center gap-3">
                <div class="col-auto">
                  <argon-button color="dark" @click="goUser()"
                    >일반이용자</argon-button
                  >
                </div>
                <div class="col-auto">
                  <argon-button>기관직원</argon-button>
                </div>
              </div>
            </div>

            <div class="card-body">
              <form role="form">
                <argon-input
                  id="name"
                  type="text"
                  placeholder="이름"
                  aria-label="Name"
                  v-model="instiUserInfo.name"
                />
                <argon-input
                  id="id"
                  type="text"
                  placeholder="아이디"
                  aria-label="Id"
                  v-model="instiUserInfo.id"
                />
                <argon-input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  aria-label="Password"
                  v-model="instiUserInfo.password"
                />
                <argon-input
                  id="passwordCheck"
                  type="password"
                  placeholder="비밀번호확인"
                  aria-laber="PasswordCheck"
                />
                <argon-input
                  id="tel"
                  type="tel"
                  placeholder="연락처 (-) 없이 입력하세요"
                  aria-label="Tel"
                  v-model="instiUserInfo.tel"
                />
                <argon-input
                  id="insti"
                  type="text"
                  placeholder="소속 기관"
                  v-model="instiUserInfo.institution_id"
                />
                <div class="text-center">
                  <argon-button
                    fullWidth
                    color="dark"
                    variant="gradient"
                    class="my-4 mb-2"
                    v-on:click.prevent="addInstiUserInfo()"
                    >회원가입 신청</argon-button
                  >
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    계정이 있으신가요?
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      @click="goLogin()"
                      >로그인</a
                    >
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <!-- <app-footer /> -->
</template>
