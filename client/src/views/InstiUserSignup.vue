<script setup>
//기관이용자 회원가입페이지
import { ref, reactive, onBeforeUnmount, onBeforeMount, computed } from "vue";
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
  // 🌟 1. [프론트 방어막] 백엔드 가기 전에 빈칸이면 여기서 바로 컷!
  if (!instiUserInfo.id.trim()) return alert("아이디를 입력해주세요.");
  if (!instiUserInfo.password.trim()) return alert("비밀번호를 입력해주세요.");
  if (!instiUserInfo.name.trim()) return alert("이름을 입력해주세요.");
  if (!instiUserInfo.tel.trim()) return alert("연락처를 입력해주세요.");
  if (!guardianEditInfo.institution_id)
    return alert("소속 기관을 선택해주세요.");

  let data = {
    institution_id: guardianEditInfo.institution_id,
    name: instiUserInfo.name,
    id: instiUserInfo.id,
    password: instiUserInfo.password,
    tel: instiUserInfo.tel,
    roll: instiUserInfo.roll,
  };
  console.log(data);

  try {
    let response = await fetch(`/api/user/instiUsers`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    let result = await response.json();

    if (result.status === "success" || result.status === "Success") {
      alert("회원가입 신청이 완료되었습니다. 승인 후 로그인 가능합니다.");
      router.push({ name: "userLogin", params: { no: result.I_UserId } });
    } else {
      // 🌟 2. [백엔드 대답 처리] 백엔드가 보내준 message를 그대로 경고창에 띄움!
      alert(result.message || "회원가입에 실패했습니다.");
      isPrinted.value = true;
    }
  } catch (err) {
    console.error(err);
    alert("서버 통신 중 오류가 발생했습니다.");
  }
};

//기관이용자 아이디 중복 확인 (김경환 2060327)
const message = ref("");

const idCheck = ref(false);
const isDuplicate = ref(false);

const checkUserId = async () => {
  if (!instiUserInfo.id) {
    alert("아이디를 입력하세요");
    return;
  }
  try {
    let res = await fetch(`/api/user/checkinstiid/${instiUserInfo.id}`);
    let result = await res.json();

    idCheck.value = true;
    isDuplicate.value = result.duplicate;

    if (result.duplicate) {
      message.value = "이미 사용중인 아이디입니다.";
    } else {
      message.value = "사용 가능한 아이디입니다.";
    }
  } catch (err) {
    console.log(err);
  }
};

//비밀번호 확인(김경환 20260329)
const passwordConfirm = ref("");

const passwordMessage = computed(() => {
  if (!passwordConfirm.value) return "";

  return instiUserInfo.password === passwordConfirm.value
    ? "비밀번호 일치"
    : "비밀번호 불일치";
});

const showInstitutionModal = ref(false);

const institutionSearch = reactive({
  sido: "",
  sigungu: "",
  keyword: "",
});

const institutionList = ref([]);
const sidoList = ref([
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
]);
const sigunguList = ref([]);

const sigunguMap = {
  서울: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  대구: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
  경기: [
    "수원시",
    "성남시",
    "용인시",
    "부천시",
    "안산시",
    "안양시",
    "화성시",
    "평택시",
  ],
};

const guardianEditInfo = reactive({
  GuserId: "",
  userId: "",
  name: "",
  tel: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
  institution: "",
  institution_id: "",
  file1: null,
  file2: null,
  joinDate: "2026.03.13 (가입 날짜로 고정)",
});

const onChangeSido = () => {
  sigunguList.value = sigunguMap[institutionSearch.sido] || [];
  institutionSearch.sigungu = "";
};

const openInstitutionModal = () => {
  showInstitutionModal.value = true;
  institutionSearch.sido = "";
  institutionSearch.sigungu = "";
  institutionSearch.keyword = "";
  institutionList.value = [];
  sigunguList.value = [];
};
const closeInstitutionModal = () => {
  showInstitutionModal.value = false;
};

const searchInstitution = async () => {
  const query = new URLSearchParams({
    sido: institutionSearch.sido,
    sigungu: institutionSearch.sigungu,
    keyword: institutionSearch.keyword,
  }).toString();

  const result = await fetch(`/api/user/institution?${query}`, {
    method: "GET",
    credentials: "include",
  })
    .then((resp) => resp.json())
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (result && result.status === "Success") {
    institutionList.value = result.data || [];
  } else {
    institutionList.value = [];
    alert(result?.message || "기관 검색 실패");
  }
};

const selectInstitution = (item) => {
  guardianEditInfo.institution = item.institution_name || "";
  guardianEditInfo.institution_id = item.institution_id || "";
  showInstitutionModal.value = false;
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
                  <argon-button color="dark" @click="goUser()">
                    일반이용자
                  </argon-button>
                </div>
                <div class="col-auto">
                  <argon-button>기관직원</argon-button>
                </div>
              </div>
            </div>

            <div class="card-body">
              <form role="login-form">
                <argon-input
                  id="name"
                  type="text"
                  placeholder="이름"
                  aria-label="Name"
                  v-model="instiUserInfo.name"
                />

                <!-- 아이디 + 중복확인 높이 맞춤 -->
                <div class="d-flex gap-2 align-items-stretch">
                  <div class="flex-grow-1">
                    <argon-input
                      id="id"
                      type="text"
                      placeholder="아이디"
                      aria-label="Id"
                      v-model="instiUserInfo.id"
                    />
                  </div>

                  <argon-button
                    color="dark"
                    size="sm"
                    class="mb-0"
                    style="height: 38px"
                    @click.prevent="checkUserId"
                  >
                    중복확인
                  </argon-button>
                </div>

                <p
                  v-if="message"
                  :style="{ color: isDuplicate ? 'red' : 'green' }"
                >
                  {{ message }}
                </p>

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
                  v-model="passwordConfirm"
                />
                <span>{{ passwordMessage }}</span>

                <argon-input
                  id="tel"
                  type="tel"
                  placeholder="연락처 (-) 없이 입력하세요"
                  aria-label="Tel"
                  v-model="instiUserInfo.tel"
                />

                <!-- 기관명 표시박스 + 기관검색 버튼 높이 맞춤 -->
                <div class="col-md-12 mt-3">
                  <label class="form-control-label">소속 기관</label>
                  <div class="d-flex gap-2 align-items-stretch">
                    <div class="flex-grow-1">
                      <div
                        class="form-control bg-light d-flex align-items-center"
                        style="height: 36px"
                      >
                        {{ guardianEditInfo.institution }}
                      </div>
                    </div>

                    <argon-button
                      color="dark"
                      size="sm"
                      class="mb-0"
                      style="height: 36px"
                      @click.prevent="openInstitutionModal"
                    >
                      기관 검색
                    </argon-button>
                  </div>
                </div>

                <div
                  v-if="showInstitutionModal"
                  class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style="background-color: rgba(0, 0, 0, 0.45); z-index: 2000"
                >
                  <div
                    class="card shadow-lg"
                    style="width: 700px; max-width: 90%"
                  >
                    <div
                      class="card-header d-flex justify-content-between align-items-center"
                    >
                      <h6 class="mb-0">기관 검색</h6>
                      <button
                        type="button"
                        class="btn-close"
                        @click="closeInstitutionModal"
                      ></button>
                    </div>

                    <div class="card-body">
                      <div class="row g-2">
                        <div class="col-md-4">
                          <label class="form-control-label">시 / 도</label>
                          <select
                            class="form-select"
                            v-model="institutionSearch.sido"
                            @change="onChangeSido"
                          >
                            <option value="">선택</option>
                            <option
                              v-for="item in sidoList"
                              :key="item"
                              :value="item"
                            >
                              {{ item }}
                            </option>
                          </select>
                        </div>

                        <div class="col-md-4">
                          <label class="form-control-label">구 / 군</label>
                          <select
                            class="form-select"
                            v-model="institutionSearch.sigungu"
                          >
                            <option value="">선택</option>
                            <option
                              v-for="item in sigunguList"
                              :key="item"
                              :value="item"
                            >
                              {{ item }}
                            </option>
                          </select>
                        </div>

                        <div class="col-md-4">
                          <label class="form-control-label">기관명</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="institutionSearch.keyword"
                            placeholder="기관명 입력"
                          />
                        </div>
                      </div>

                      <div class="mt-3 text-end">
                        <argon-button
                          color="secondary"
                          class="me-2"
                          @click="closeInstitutionModal"
                        >
                          닫기
                        </argon-button>
                        <argon-button
                          color="dark"
                          @click.prevent="searchInstitution"
                        >
                          검색
                        </argon-button>
                      </div>

                      <hr />

                      <div style="max-height: 300px; overflow-y: auto">
                        <table class="table align-items-center mb-0">
                          <thead>
                            <tr>
                              <th
                                class="text-secondary text-xs font-weight-bolder opacity-7"
                              >
                                기관명
                              </th>
                              <th
                                class="text-secondary text-xs font-weight-bolder opacity-7"
                              >
                                주소
                              </th>
                              <th
                                class="text-secondary text-xs font-weight-bolder opacity-7 text-center"
                              >
                                선택
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-if="!institutionList.length">
                              <td
                                colspan="3"
                                class="text-center text-muted py-3"
                              >
                                검색 결과가 없습니다.
                              </td>
                            </tr>

                            <tr
                              v-for="item in institutionList"
                              :key="item.institution_id"
                            >
                              <td>{{ item.institution_name }}</td>
                              <td>{{ item.address }}</td>
                              <td class="text-center">
                                <argon-button
                                  size="sm"
                                  color="info"
                                  @click="selectInstitution(item)"
                                >
                                  선택
                                </argon-button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="text-center">
                  <argon-button
                    fullWidth
                    color="dark"
                    variant="gradient"
                    class="my-4 mb-2"
                    v-on:click.prevent="addInstiUserInfo()"
                  >
                    회원가입 신청
                  </argon-button>
                </div>

                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    계정이 있으신가요?
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      @click="goLogin()"
                    >
                      로그인
                    </a>
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
