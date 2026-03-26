<script setup>
//일반이용자 회원가입 페이지
import { ref, reactive, onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";

import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();

//우편번호, 주소 관련 api를 위한 ref()(김경환 2026.03.24)
const zipCode = ref("");
const detailRef = ref(null);
const mainAddress = ref("");
const detailAddress = ref("");

//파일을 담기위한 ref배열(김경환 2026.03.24)
const files = ref([]);

//두 개의 파일을 첨부
//만약 동일한 파일을 첨부하거나 두 개 이상을 첨부하려 할 경우 alert창
const multiFiles = (event) => {
  const input = event.target;
  if (!input.files.length) return;
  const selectedFiles = Array.from(input.files);
  //기존 파일을 담는 배열 함수
  let tempFiles = [...files.value];

  //각 파일들을 비교 후 첨부
  //some(): 배열안에 특정 조건을 찾는데 사용(파일 이름)
  selectedFiles.forEach((newFile) => {
    const isSameFile = tempFiles.some(
      (file) => file.name === newFile.name && newFile.size,
    );
    if (isSameFile) {
      alert(`중복된 파일입니다. 다시 확인해주세요.`);
    } else {
      if (tempFiles.length < 2) {
        tempFiles.push(newFile);
      } else {
        alert(`파일은 최대 두 개만 첨부 가능합니다.`);
      }
    }
  });

  files.value = tempFiles;
  // console.log("첨부된 파일:", files.value); //파일 첨부 확인을 위한 console.log()
  //다음 파일 선택을 위해 input값 초기화
  input.value = "";
};

// 특정 파일 선택 삭제(김경환 2026.03.24)
const removeFiles = (index) => {
  files.value.splice(index, 1);
};

//회원가입 reactive
const userInfo = reactive({
  //서버와 통신
  institution_id: "",
  name: "",
  id: "",
  password: "",
  tel: "",
  email: "",
  zipCode: zipCode.value,
  address: `${mainAddress.value} ${detailAddress.value}`.trim(),
  document1: "", // 나중에 수정
  document2: "", // 나중에 수정
});
const isPrinted = ref(false);

import { useRouter } from "vue-router";
const router = useRouter();

//기관이용자 이동 라우터(김경환 2026.03.24)
const goInsti = () => {
  router.push("/insti/signup");
};

//로그인 페이지로 이동하는 라우터(김경환 2026.03.25)
const goLogin = () => {
  router.push("/user/login");
};

const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      zipCode.value = data.zonecode;
      mainAddress.value = data.roadAddress;
      detailRef.value.$el.querySelector("input").focus();
    },
  }).open();
};

//일반이용자의 정보를 db에 전송시키는 함수(김경환 2026.03.24)
const addUserInfo = async () => {
  let data = {
    institution_id: userInfo.institution_id,
    name: userInfo.name,
    id: userInfo.id,
    password: userInfo.password,
    tel: userInfo.tel,
    email: userInfo.email,
    zipCode: zipCode.value,
    address: `${mainAddress.value} ${detailAddress.value}`.trim(),
    document1: userInfo.document1,
    document2: userInfo.document2,
  };
  console.log(data);

  let result = await fetch(`/api/user/users`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  if (result.status == "success") {
    router.push({ name: "userLogin", params: { no: result.G_userId } });
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
              아래의 정보들을 입력한 후 회원가입을 신청해 주세요.
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
                  <argon-button>일반이용자</argon-button>
                </div>
                <div class="col-auto">
                  <argon-button color="dark" @click="goInsti()"
                    >기관직원</argon-button
                  >
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
                  v-model="userInfo.name"
                />
                <div class="row">
                  <div class="col-md-12">
                    <argon-input
                      id="id"
                      type="text"
                      placeholder="아이디"
                      aria-label="Id"
                      v-model="userInfo.id"
                    />
                    <argon-button>중복 확인</argon-button>
                  </div>
                </div>
                <argon-input
                  id="password"
                  type="password"
                  placeholder="비밀번호"
                  aria-label="Password"
                  v-model="userInfo.password"
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
                  placeholder="연락처 (-) 없이 입력하세요."
                  aria-label="Tel"
                  v-model="userInfo.tel"
                />
                <argon-input
                  id="email"
                  type="email"
                  placeholder="이메일"
                  aria-label="Email"
                  v-model="userInfo.email"
                />
                <div class="row">
                  <div class="col-md-12">
                    <label class="form-control-label">주소</label>
                    <div class="row g-2 mb-2 align-items-stretch">
                      <div class="col-4">
                        <argon-input
                          class="mb-0"
                          type="text"
                          readonly
                          v-model="zipCode"
                          placeholder="우편번호"
                          isRequired
                        />
                      </div>

                      <div class="col-auto d-flex">
                        <argon-button
                          class="mb-0 px-3"
                          @click.prevent="openPostcode()"
                        >
                          주소 검색
                        </argon-button>
                      </div>
                    </div>
                    <div class="row g-2">
                      <div class="col-md-12">
                        <argon-input
                          class="mb-0"
                          type="text"
                          readonly
                          :value="mainAddress"
                          v-model="mainAddress"
                          placeholder="기본주소"
                          isRequired
                        />
                      </div>

                      <div class="col-md-12">
                        <argon-input
                          class="mb-0"
                          type="text"
                          :value="detailAddress"
                          v-model="detailAddress"
                          placeholder="상세주소 입력"
                          ref="detailRef"
                          isRequired
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4"></div>
                </div>
                <div class="mt-2">
                  <argon-input
                    id="file"
                    type="file"
                    multiple
                    placeholder="파일첨부"
                    @change="multiFiles"
                  />
                  <div v-if="files.length > 0">
                    <p class="font-weight-bold mb-1">
                      (선택된 파일 {{ files.length }} / 2)
                    </p>
                    <ul class="list-unstyled">
                      <li
                        v-for="(file, index) in files"
                        :key="index"
                        class="d-flex justify-content-between align-items-center mb-1"
                      >
                        <span> {{ file.name }}</span>
                        <argon-button
                          type="button"
                          class="btn-close"
                          style="font-size: 0.5rem"
                          @click="removeFiles(index)"
                        >
                          X
                        </argon-button>
                      </li>
                    </ul>
                  </div>
                </div>
                <argon-input
                  id="institution"
                  type="text"
                  placeholder="기관 선택"
                  v-model="userInfo.institution_id"
                />
                <div class="text-center">
                  <argon-button
                    fullWidth
                    color="dark"
                    variant="gradient"
                    class="my-4 mb-2"
                    v-on:click.prevent="addUserInfo()"
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
