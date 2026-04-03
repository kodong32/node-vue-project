<script setup>
//일반이용자 회원가입 페이지
import { ref, reactive, onBeforeUnmount, onBeforeMount, computed } from "vue";
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

  //파일 용량 제한(20MB)
  const MAX_TOTAL_FILE_SIZE = 20 * 1024 * 1024;

  //각 파일들을 비교 후 첨부
  //some(): 배열안에 특정 조건을 찾는데 사용(파일 이름) //파일 용량제한 추가(김경환 20260330)
  selectedFiles.forEach((newFile) => {
    if (newFile.size > MAX_TOTAL_FILE_SIZE) {
      alert(`첨부파일의 용량이 20MB를 초과하였습니다.`);
      return;
    }
    const isSameFile = tempFiles.some(
      (file) => file.name === newFile.name && file.size === newFile.size,
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

//일반이용자 아이디 중복 확인 (김경환 2060327)
const message = ref("");

// const idCheck = ref(false);
const isDuplicate = ref(false);

// const checkUserId = async () => {
//   if (!userInfo.id) {
//     alert("아이디를 입력하세요");
//     return;
//   }
//   try {
//     let res = await fetch(`/api/user/checkid/${userInfo.id}`);
//     let result = await res.json();

//     idCheck.value = true;
//     isDuplicate.value = result.duplicate;

//     if (result.duplicate) {
//       message.value = "이미 사용중인 아이디입니다.";
//     } else {
//       message.value = "사용 가능한 아이디입니다.";
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

//비밀번호 확인(김경환 20260329)
const passwordConfirm = ref("");

// const signup = async () => {
//   if (userInfo.password !== passwordConfirm.value) {
//     alert("비밀번호가 일치하지 않습니다.");
//     return;
//   }

//   //비밀번호 길이 확인
//   if (userInfo.password.length < 5) {
//     alert("5자리 이상의 비밀번호를 설정해주세요.");
//     return;
//   }

//   //서버 전송
//   await fetch("/api/user", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userInfo),
//   });
// };

const passwordMessage = computed(() => {
  if (!passwordConfirm.value) return "";

  return userInfo.password === passwordConfirm.value
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

  const result = await fetch(`/api/user/institutions?${query}`, {
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
              <form role="login-form">
                <argon-input
                  id="name"
                  type="text"
                  placeholder="이름"
                  aria-label="Name"
                  v-model="userInfo.name"
                />
                <div class="d-flex gap-2">
                  <argon-input
                    id="id"
                    type="text"
                    placeholder="아이디"
                    aria-label="Id"
                    v-model="userInfo.id"
                  />
                  <!-- <argon-button
                    class="mt-auto p-3 d-flex justify-content-center gap-3"
                    @click.prevent="checkUserId"
                    >중복확인</argon-button
                  > -->
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
                  v-model="userInfo.password"
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
                    <div
                      class="row g-2 mb-2 align-items-stretch justify-content-start"
                    >
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
                <div class="col-md-12 mt-3">
                  <label class="form-control-label">등록된 기관명</label>
                  <div class="d-flex gap-2 align-items-center">
                    <div class="flex-grow-1">
                      <div class="form-control bg-light">
                        {{ guardianEditInfo.institution }}
                      </div>
                    </div>
                    <argon-button
                      color="dark"
                      size="sm"
                      @click.prevent="openInstitutionModal"
                      >기관 검색</argon-button
                    >
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
