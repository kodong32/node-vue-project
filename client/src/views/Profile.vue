<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount, reactive } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const body = document.getElementsByTagName("body")[0];

const store = useStore();

const zipCode = ref("");
const detailRef = ref(null);
const mainAddress = ref("");
const detailAddress = ref("");

const supInfo = reactive({
  G_UserId: "GUSR0000", //현재 테스트를 위한 하드코딩상태임 Session 추가 시 변경예정 26.03.24
  I_userId1: null,
  I_userId2: null,
  name: "",
  born: "",
  gender: null,
  relation: null,
  zipCode: "",
  address: "",
  major: [],
  middle: [],
  sub: "",
});

onMounted(() => {
  store.state.isAbsolute = true;
});

onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = false;
  store.state.hideConfigButton = true;
  store.state.showSidenav = false;
  body.classList.add("profile-overview");
});
onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  store.state.showSidenav = true;
  body.classList.remove("profile-overview");
});

const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      zipCode.value = data.zonecode;
      mainAddress.value = data.roadAddress;
      detailRef.value.$el.querySelector("input").focus();
    },
  }).open();
};

const addSupport = async () => {
  let data = {
    G_UserId: supInfo.G_UserId,
    I_userId1: null,
    I_userId2: null,
    name: supInfo.name,
    born: supInfo.born,
    gender: supInfo.gender,
    relation: supInfo.relation,
    zipCode: zipCode.value,
    address: `${mainAddress.value} ${detailAddress.value}`.trim(),
    major: supInfo.major.join(","), 
    middle: supInfo.middle.join(","), 
    sub: supInfo.sub,
  };

  let result = await fetch("/api/user/support/add", {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  }).then((resp) => resp.json());
  if (result.status == "Success") {
    console.log("Success");
  } else {
    console.log("Failed");
  }
};
</script>
<template>
  <main>
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
                  src="../assets/img/team-1.jpg"
                  alt="profile_image"
                  class="shadow-sm w-100 border-radius-lg"
                />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <ul class="nav nav-pills custom-top-menu" role="tablist">
                  <li class="nav-item">
                    <a
                      class="px-3 py-2 nav-link active"
                      data-bs-toggle="tab"
                      href="javascript:;"
                      role="tab"
                      aria-selected="true"
                    >
                      <svg
                        class="text-dark"
                        width="16px"
                        height="16px"
                        viewBox="0 0 42 42"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g
                            transform="translate(-2319.000000, -291.000000)"
                            fill="#FFFFFF"
                            fill-rule="nonzero"
                          >
                            <g transform="translate(1716.000000, 291.000000)">
                              <g transform="translate(603.000000, 0.000000)">
                                <path
                                  class="color-background"
                                  d="M22.7597136,19.3090182 L38.8987031,11.2395234 C39.3926816,10.9925342 39.592906,10.3918611 39.3459167,9.89788265 C39.249157,9.70436312 39.0922432,9.5474453 38.8987261,9.45068056 L20.2741875,0.1378125 L20.2741875,0.1378125 C19.905375,-0.04725 19.469625,-0.04725 19.0995,0.1378125 L3.1011696,8.13815822 C2.60720568,8.38517662 2.40701679,8.98586148 2.6540352,9.4798254 C2.75080129,9.67332903 2.90771305,9.83023153 3.10122239,9.9269862 L21.8652864,19.3090182 C22.1468139,19.4497819 22.4781861,19.4497819 22.7597136,19.3090182 Z"
                                />
                                <path
                                  class="color-background"
                                  d="M23.625,22.429159 L23.625,39.8805372 C23.625,40.4328219 24.0727153,40.8805372 24.625,40.8805372 C24.7802551,40.8805372 24.9333778,40.8443874 25.0722402,40.7749511 L41.2741875,32.673375 L41.2741875,32.673375 C41.719125,32.4515625 42,31.9974375 42,31.5 L42,14.241659 C42,13.6893742 41.5522847,13.241659 41,13.241659 C40.8447549,13.241659 40.6916418,13.2778041 40.5527864,13.3472318 L24.1777864,21.5347318 C23.8390024,21.7041238 23.625,22.0503869 23.625,22.429159 Z"
                                  opacity="0.7"
                                />
                                <path
                                  class="color-background"
                                  d="M20.4472136,21.5347318 L1.4472136,12.0347318 C0.953235098,11.7877425 0.352562058,11.9879669 0.105572809,12.4819454 C0.0361450918,12.6208008 6.47121774e-16,12.7739139 0,12.929159 L0,30.1875 L0,30.1875 C0,30.6849375 0.280875,31.1390625 0.7258125,31.3621875 L19.5528096,40.7750766 C20.0467945,41.0220531 20.6474623,40.8218132 20.8944388,40.3278283 C20.963859,40.1889789 21,40.0358742 21,39.8806379 L21,22.429159 C21,22.0503869 20.7859976,21.7041238 20.4472136,21.5347318 Z"
                                  opacity="0.7"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span class="ms-1">첫 화면</span>
                    </a>
                  </li>

                  <li class="nav-item">
                    <a
                      class="px-3 py-2 nav-link active"
                      data-bs-toggle="tab"
                      href="javascript:;"
                      role="tab"
                      aria-selected="true"
                    >
                      <svg
                        class="text-dark"
                        width="16px"
                        height="16px"
                        viewBox="0 0 42 42"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g
                            transform="translate(-2319.000000, -291.000000)"
                            fill="#FFFFFF"
                            fill-rule="nonzero"
                          >
                            <g transform="translate(1716.000000, 291.000000)">
                              <g transform="translate(603.000000, 0.000000)">
                                <path
                                  class="color-background"
                                  d="M22.7597136,19.3090182 L38.8987031,11.2395234 C39.3926816,10.9925342 39.592906,10.3918611 39.3459167,9.89788265 C39.249157,9.70436312 39.0922432,9.5474453 38.8987261,9.45068056 L20.2741875,0.1378125 L20.2741875,0.1378125 C19.905375,-0.04725 19.469625,-0.04725 19.0995,0.1378125 L3.1011696,8.13815822 C2.60720568,8.38517662 2.40701679,8.98586148 2.6540352,9.4798254 C2.75080129,9.67332903 2.90771305,9.83023153 3.10122239,9.9269862 L21.8652864,19.3090182 C22.1468139,19.4497819 22.4781861,19.4497819 22.7597136,19.3090182 Z"
                                />
                                <path
                                  class="color-background"
                                  d="M23.625,22.429159 L23.625,39.8805372 C23.625,40.4328219 24.0727153,40.8805372 24.625,40.8805372 C24.7802551,40.8805372 24.9333778,40.8443874 25.0722402,40.7749511 L41.2741875,32.673375 L41.2741875,32.673375 C41.719125,32.4515625 42,31.9974375 42,31.5 L42,14.241659 C42,13.6893742 41.5522847,13.241659 41,13.241659 C40.8447549,13.241659 40.6916418,13.2778041 40.5527864,13.3472318 L24.1777864,21.5347318 C23.8390024,21.7041238 23.625,22.0503869 23.625,22.429159 Z"
                                  opacity="0.7"
                                />
                                <path
                                  class="color-background"
                                  d="M20.4472136,21.5347318 L1.4472136,12.0347318 C0.953235098,11.7877425 0.352562058,11.9879669 0.105572809,12.4819454 C0.0361450918,12.6208008 6.47121774e-16,12.7739139 0,12.929159 L0,30.1875 L0,30.1875 C0,30.6849375 0.280875,31.1390625 0.7258125,31.3621875 L19.5528096,40.7750766 C20.0467945,41.0220531 20.6474623,40.8218132 20.8944388,40.3278283 C20.963859,40.1889789 21,40.0358742 21,39.8806379 L21,22.429159 C21,22.0503869 20.7859976,21.7041238 20.4472136,21.5347318 Z"
                                  opacity="0.7"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span class="ms-1">공지사항</span>
                    </a>
                  </li>

                  <li class="nav-item">
                    <a
                      class="px-3 py-2 nav-link active"
                      data-bs-toggle="tab"
                      href="javascript:;"
                      role="tab"
                      aria-selected="true"
                    >
                      <svg
                        class="text-dark"
                        width="16px"
                        height="16px"
                        viewBox="0 0 42 42"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g
                            transform="translate(-2319.000000, -291.000000)"
                            fill="#FFFFFF"
                            fill-rule="nonzero"
                          >
                            <g transform="translate(1716.000000, 291.000000)">
                              <g transform="translate(603.000000, 0.000000)">
                                <path
                                  class="color-background"
                                  d="M22.7597136,19.3090182 L38.8987031,11.2395234 C39.3926816,10.9925342 39.592906,10.3918611 39.3459167,9.89788265 C39.249157,9.70436312 39.0922432,9.5474453 38.8987261,9.45068056 L20.2741875,0.1378125 L20.2741875,0.1378125 C19.905375,-0.04725 19.469625,-0.04725 19.0995,0.1378125 L3.1011696,8.13815822 C2.60720568,8.38517662 2.40701679,8.98586148 2.6540352,9.4798254 C2.75080129,9.67332903 2.90771305,9.83023153 3.10122239,9.9269862 L21.8652864,19.3090182 C22.1468139,19.4497819 22.4781861,19.4497819 22.7597136,19.3090182 Z"
                                />
                                <path
                                  class="color-background"
                                  d="M23.625,22.429159 L23.625,39.8805372 C23.625,40.4328219 24.0727153,40.8805372 24.625,40.8805372 C24.7802551,40.8805372 24.9333778,40.8443874 25.0722402,40.7749511 L41.2741875,32.673375 L41.2741875,32.673375 C41.719125,32.4515625 42,31.9974375 42,31.5 L42,14.241659 C42,13.6893742 41.5522847,13.241659 41,13.241659 C40.8447549,13.241659 40.6916418,13.2778041 40.5527864,13.3472318 L24.1777864,21.5347318 C23.8390024,21.7041238 23.625,22.0503869 23.625,22.429159 Z"
                                  opacity="0.7"
                                />
                                <path
                                  class="color-background"
                                  d="M20.4472136,21.5347318 L1.4472136,12.0347318 C0.953235098,11.7877425 0.352562058,11.9879669 0.105572809,12.4819454 C0.0361450918,12.6208008 6.47121774e-16,12.7739139 0,12.929159 L0,30.1875 L0,30.1875 C0,30.6849375 0.280875,31.1390625 0.7258125,31.3621875 L19.5528096,40.7750766 C20.0467945,41.0220531 20.6474623,40.8218132 20.8944388,40.3278283 C20.963859,40.1889789 21,40.0358742 21,39.8806379 L21,22.429159 C21,22.0503869 20.7859976,21.7041238 20.4472136,21.5347318 Z"
                                  opacity="0.7"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span class="ms-1">지원 계획서</span>
                    </a>
                  </li>

                  <li class="nav-item">
                    <a
                      class="px-3 py-2 nav-link active"
                      data-bs-toggle="tab"
                      href="javascript:;"
                      role="tab"
                      aria-selected="true"
                    >
                      <svg
                        class="text-dark"
                        width="16px"
                        height="16px"
                        viewBox="0 0 42 42"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g
                            transform="translate(-2319.000000, -291.000000)"
                            fill="#FFFFFF"
                            fill-rule="nonzero"
                          >
                            <g transform="translate(1716.000000, 291.000000)">
                              <g transform="translate(603.000000, 0.000000)">
                                <path
                                  class="color-background"
                                  d="M22.7597136,19.3090182 L38.8987031,11.2395234 C39.3926816,10.9925342 39.592906,10.3918611 39.3459167,9.89788265 C39.249157,9.70436312 39.0922432,9.5474453 38.8987261,9.45068056 L20.2741875,0.1378125 L20.2741875,0.1378125 C19.905375,-0.04725 19.469625,-0.04725 19.0995,0.1378125 L3.1011696,8.13815822 C2.60720568,8.38517662 2.40701679,8.98586148 2.6540352,9.4798254 C2.75080129,9.67332903 2.90771305,9.83023153 3.10122239,9.9269862 L21.8652864,19.3090182 C22.1468139,19.4497819 22.4781861,19.4497819 22.7597136,19.3090182 Z"
                                />
                                <path
                                  class="color-background"
                                  d="M23.625,22.429159 L23.625,39.8805372 C23.625,40.4328219 24.0727153,40.8805372 24.625,40.8805372 C24.7802551,40.8805372 24.9333778,40.8443874 25.0722402,40.7749511 L41.2741875,32.673375 L41.2741875,32.673375 C41.719125,32.4515625 42,31.9974375 42,31.5 L42,14.241659 C42,13.6893742 41.5522847,13.241659 41,13.241659 C40.8447549,13.241659 40.6916418,13.2778041 40.5527864,13.3472318 L24.1777864,21.5347318 C23.8390024,21.7041238 23.625,22.0503869 23.625,22.429159 Z"
                                  opacity="0.7"
                                />
                                <path
                                  class="color-background"
                                  d="M20.4472136,21.5347318 L1.4472136,12.0347318 C0.953235098,11.7877425 0.352562058,11.9879669 0.105572809,12.4819454 C0.0361450918,12.6208008 6.47121774e-16,12.7739139 0,12.929159 L0,30.1875 L0,30.1875 C0,30.6849375 0.280875,31.1390625 0.7258125,31.3621875 L19.5528096,40.7750766 C20.0467945,41.0220531 20.6474623,40.8218132 20.8944388,40.3278283 C20.963859,40.1889789 21,40.0358742 21,39.8806379 L21,22.429159 C21,22.0503869 20.7859976,21.7041238 20.4472136,21.5347318 Z"
                                  opacity="0.7"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span class="ms-1">지원 결과</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="position-absolute top-50 start-50 translate-middle text-center fw-bold"
            >
              홍길동님 환영합니다
            </div>

            <div class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0">
              <div class="nav-wrapper position-relative end-0">
                <ul class="p-1 bg-transparent nav nav-pills nav-fill" role="tablist">
                  <li class="nav-item">
                    <a
                      class="px-3 py-2 mb-0 nav-link active"
                      data-bs-toggle="tab"
                      href="javascript:;"
                      role="tab"
                      aria-selected="true"
                    >
                      <svg
                        class="text-dark"
                        width="16px"
                        height="16px"
                        viewBox="0 0 42 42"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g
                            transform="translate(-2319.000000, -291.000000)"
                            fill="#FFFFFF"
                            fill-rule="nonzero"
                          >
                            <g transform="translate(1716.000000, 291.000000)">
                              <g transform="translate(603.000000, 0.000000)">
                                <path
                                  class="color-background"
                                  d="M22.7597136,19.3090182 L38.8987031,11.2395234 C39.3926816,10.9925342 39.592906,10.3918611 39.3459167,9.89788265 C39.249157,9.70436312 39.0922432,9.5474453 38.8987261,9.45068056 L20.2741875,0.1378125 L20.2741875,0.1378125 C19.905375,-0.04725 19.469625,-0.04725 19.0995,0.1378125 L3.1011696,8.13815822 C2.60720568,8.38517662 2.40701679,8.98586148 2.6540352,9.4798254 C2.75080129,9.67332903 2.90771305,9.83023153 3.10122239,9.9269862 L21.8652864,19.3090182 C22.1468139,19.4497819 22.4781861,19.4497819 22.7597136,19.3090182 Z"
                                />
                                <path
                                  class="color-background"
                                  d="M23.625,22.429159 L23.625,39.8805372 C23.625,40.4328219 24.0727153,40.8805372 24.625,40.8805372 C24.7802551,40.8805372 24.9333778,40.8443874 25.0722402,40.7749511 L41.2741875,32.673375 L41.2741875,32.673375 C41.719125,32.4515625 42,31.9974375 42,31.5 L42,14.241659 C42,13.6893742 41.5522847,13.241659 41,13.241659 C40.8447549,13.241659 40.6916418,13.2778041 40.5527864,13.3472318 L24.1777864,21.5347318 C23.8390024,21.7041238 23.625,22.0503869 23.625,22.429159 Z"
                                  opacity="0.7"
                                />
                                <path
                                  class="color-background"
                                  d="M20.4472136,21.5347318 L1.4472136,12.0347318 C0.953235098,11.7877425 0.352562058,11.9879669 0.105572809,12.4819454 C0.0361450918,12.6208008 6.47121774e-16,12.7739139 0,12.929159 L0,30.1875 L0,30.1875 C0,30.6849375 0.280875,31.1390625 0.7258125,31.3621875 L19.5528096,40.7750766 C20.0467945,41.0220531 20.6474623,40.8218132 20.8944388,40.3278283 C20.963859,40.1889789 21,40.0358742 21,39.8806379 L21,22.429159 C21,22.0503869 20.7859976,21.7041238 20.4472136,21.5347318 Z"
                                  opacity="0.7"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span class="ms-1">My Page</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="px-3 py-2 mb-0 nav-link"
                      data-bs-toggle="tab"
                      href="javascript:;"
                      role="tab"
                      aria-selected="false"
                    >
                      <svg
                        class="text-dark"
                        width="16px"
                        height="16px"
                        viewBox="0 0 40 44"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <title>document</title>
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g
                            transform="translate(-1870.000000, -591.000000)"
                            fill="#FFFFFF"
                            fill-rule="nonzero"
                          >
                            <g transform="translate(1716.000000, 291.000000)">
                              <g transform="translate(154.000000, 300.000000)">
                                <path
                                  class="color-background"
                                  d="M40,40 L36.3636364,40 L36.3636364,3.63636364 L5.45454545,3.63636364 L5.45454545,0 L38.1818182,0 C39.1854545,0 40,0.814545455 40,1.81818182 L40,40 Z"
                                  opacity="0.603585379"
                                />
                                <path
                                  class="color-background"
                                  d="M30.9090909,7.27272727 L1.81818182,7.27272727 C0.814545455,7.27272727 0,8.08727273 0,9.09090909 L0,41.8181818 C0,42.8218182 0.814545455,43.6363636 1.81818182,43.6363636 L30.9090909,43.6363636 C31.9127273,43.6363636 32.7272727,42.8218182 32.7272727,41.8181818 L32.7272727,9.09090909 C32.7272727,8.08727273 31.9127273,7.27272727 30.9090909,7.27272727 Z M18.1818182,34.5454545 L7.27272727,34.5454545 L7.27272727,30.9090909 L18.1818182,30.9090909 L18.1818182,34.5454545 Z M25.4545455,27.2727273 L7.27272727,27.2727273 L7.27272727,23.6363636 L25.4545455,23.6363636 L25.4545455,27.2727273 Z M25.4545455,20 L7.27272727,20 L7.27272727,16.3636364 L25.4545455,16.3636364 L25.4545455,20 Z"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
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

    <div class="py-4 container-fluid">
      <div class="row align-items-stretch">
        <div class="col-md-4">
          <div class="row g-0 h-100">
            <!-- 1번 -->
            <div class="col-6">
              <div class="card h-100 rounded-0 border border-secondary">
                <div class="card-header pb-0 border-bottom">
                  <h6 class="mb-1 text-dark">보호자</h6>
                  <p class="text-sm mb-2">홍길동님의 정보</p>
                </div>

                <div class="card-body p-0 d-flex flex-column">
                  <div
                    class="border-bottom d-flex flex-column justify-content-center px-3"
                    style="height: 69px"
                  >
                    <div class="text-sm">아이디</div>
                    <div class="fw-bold">Hongil</div>
                  </div>

                  <div
                    class="border-bottom d-flex flex-column justify-content-center px-3"
                    style="height: 70px"
                  >
                    <div class="text-sm">연락처</div>
                    <div class="fw-bold">010-1234-5678</div>
                  </div>

                  <div
                    class="border-bottom d-flex flex-column justify-content-center px-3"
                    style="height: 70px"
                  >
                    <div class="text-sm">이메일</div>
                    <div class="fw-bold text-decoration-underline">aaa123@mail.com</div>
                  </div>

                  <div
                    class="border-bottom d-flex flex-column justify-content-center px-3"
                    style="height: 70px"
                  >
                    <div class="text-sm">주소</div>
                    <div class="text-sm">대구광역시 예담구 예담로30</div>
                  </div>

                  <div class="p-2">
                    <div class="text-sm">등록된 기관명</div>
                    <div class="text-sm">대구 예담 지원센터</div>
                  </div>

                  <div class="mt-auto p-2">
                    <argon-button color="secondary" class="w-100">
                      내 정보 수정
                    </argon-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2번 -->
            <div class="col-6">
              <div class="card h-100 rounded-0 border border-secondary border-start-0">
                <div class="card-header text-center border-bottom">
                  <h6 class="mb-2 fw-bold">지원 대상자 목록</h6>
                </div>

                <div class="card-body p-0 d-flex flex-column">
                  <div
                    class="d-flex justify-content-between align-items-center px-3 border-bottom"
                    style="height: 70px"
                  >
                    <span>홍순</span>
                    <argon-button size="sm" color="dark">수정</argon-button>
                  </div>

                  <div
                    class="d-flex justify-content-between align-items-center px-3 border-bottom"
                    style="height: 70px"
                  >
                    <span>홍아들</span>
                    <argon-button size="sm" color="dark">수정</argon-button>
                  </div>

                  <div
                    class="d-flex justify-content-between align-items-center px-3 border-bottom"
                    style="height: 70px"
                  >
                    <span>홍철수</span>
                    <argon-button size="sm" color="dark">수정</argon-button>
                  </div>

                  <div class="mt-auto p-2 position-relative">
                    <argon-button color="secondary" class="w-100">
                      지원 대상자 등록
                    </argon-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-8">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">지원 대상자 등록</p>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">지원 대상자 정보</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="name" class="form-control-label">이름</label>
                  <argon-input
                    name="name"
                    type="text"
                    v-model="supInfo.name"
                    isRequired
                  />
                </div>
                <div class="col-md-6">
                  <label for="date" class="form-control-label">생년월일</label>
                  <argon-input
                    id="date"
                    type="date"
                    v-model="supInfo.born"
                    isRequired
                  ></argon-input>
                </div>
                <div class="col-md-6">
                  <label for="gender" class="form-control-label">성별</label>
                  <div class="d-flex align-items-center gap-3">
                    <input
                      class="form-input"
                      type="radio"
                      id="male"
                      name="gender"
                      value="c001"
                      v-model="supInfo.gender"
                    />
                    <label class="form-check-label" for="male">남자</label>
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="c002"
                      v-model="supInfo.gender"
                    />
                    <label class="form-check-label" for="female">여자</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="rel" class="form-control-label">관계</label>
                  <div class="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      id="parent"
                      name="rel"
                      value="d001"
                      checked
                      v-model="supInfo.relation"
                    /><label for="parent">부모</label>

                    <input
                      type="radio"
                      id="child"
                      name="rel"
                      value="d002"
                      v-model="supInfo.relation"
                    /><label for="child">자녀</label>
                    <input
                      type="radio"
                      id="prod"
                      name="rel"
                      value="d003"
                      v-model="supInfo.relation"
                    /><label for="prod">요양보호사</label>
                  </div>
                </div>
              </div>

              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">Contact Information</p>
              <div class="row">
                <div class="col-md-12">
                  <label class="form-control-label">주소</label>
                  <div class="row g-2 mb-2 align-items-stretch">
                    <div class="col-2">
                      <argon-input
                        class="mb-0"
                        type="text"
                        readOnly
                        v-model="zipCode"
                        placeholder="우편번호"
                        isRequired
                      />
                    </div>

                    <div class="col-auto d-flex">
                      <argon-button class="mb-0 px-3" @click="openPostcode()">
                        주소 검색
                      </argon-button>
                    </div>
                  </div>
                  <div class="row g-2">
                    <div class="col-md-6">
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

                    <div class="col-md-6">
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
                <div class="col-md-4">
                  <label for="major" class="form-control-label">장애유형</label>
                </div>
              </div>
              <div class="row g-2">
                <div class="col">
                  <select class="form-select" multiple v-model="supInfo.major">
                    <option disabled value="">대분류선택</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <div class="col">
                  <select class="form-select" multiple v-model="supInfo.middle">
                    <option disabled value="">중분류선택</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <div class="col">
                  <argon-input
                    class="mb-0"
                    type="text"
                    placeholder="기타사항 입력"
                    v-model="supInfo.sub"
                  />
                </div>
              </div>
              <hr class="horizontal dark" />
              <div class="row">
                <div class="col-md-12">
                  <argon-button class="w-100 mb-0 py-3" @click="addSupport()">
                    등록
                  </argon-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
