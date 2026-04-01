<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount, reactive, computed } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import RoleHeader from "./components/RoleHeader.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userId = route.params.userId;

const body = document.getElementsByTagName("body")[0];
const store = useStore();

const detailRef = ref(null);
const majorList = ref([]);
const middleList = ref([]);

const showSupAddForm = ref(false);
const showGuardianEditForm = ref(false);
const isEdit = ref(false);
const supList = ref([]);

/** 지원 대상자 폼용 주소 */
const zipCode = ref("");
const mainAddress = ref("");
const detailAddress = ref("");

/** 보호자 폼용 주소 */
const guardianZipCode = ref("");
const guardianMainAddress = ref("");
const guardianDetailAddress = ref("");

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
  경기: ["수원시", "성남시", "용인시", "부천시", "안산시", "안양시", "화성시", "평택시"],
};

const guardianInfo = reactive({
  GuserId: "",
  userId: "",
  name: "",
  tel: "",
  email: "",
  address: "",
  institution: "",
  institution_id: "",
});

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

const supInfo = reactive({
  support_id: "",
  G_UserId: userId, // 현재 테스트용
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
  getMajorList();
  getGuardianInfo(userId);
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

const resetSupForm = () => {
  supInfo.support_id = "";
  supInfo.name = "";
  supInfo.born = "";
  supInfo.gender = "";
  supInfo.relation = "";
  supInfo.major = [];
  supInfo.middle = [];
  supInfo.sub = "";
  supInfo.G_UserId = userId;
  supInfo.I_userId1 = null;
  supInfo.I_userId2 = null;

  zipCode.value = "";
  mainAddress.value = "";
  detailAddress.value = "";
  middleList.value = [];
};

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

const resetGuardianForm = () => {
  guardianEditInfo.GuserId = guardianInfo.GuserId || "";
  guardianEditInfo.userId = guardianInfo.userId || "";
  guardianEditInfo.name = guardianInfo.name || "";
  guardianEditInfo.tel = guardianInfo.tel || "";
  guardianEditInfo.email = guardianInfo.email || "";
  guardianEditInfo.currentPassword = "";
  guardianEditInfo.newPassword = "";
  guardianEditInfo.newPasswordConfirm = "";
  guardianEditInfo.institution = guardianInfo.institution || "";
  guardianEditInfo.institution_id = guardianInfo.institution_id || "";
  guardianEditInfo.file1 = null;
  guardianEditInfo.file2 = null;

  guardianZipCode.value = "";
  guardianMainAddress.value = guardianInfo.address || "";
  guardianDetailAddress.value = "";
};

const toggleSupForm = () => {
  if (!showSupAddForm.value) {
    isEdit.value = false;
    resetSupForm();
    supInfo.G_UserId = userId;
  }

  showGuardianEditForm.value = false;
  showSupAddForm.value = !showSupAddForm.value;
};

const toggleGuardianForm = () => {
  if (!showGuardianEditForm.value) {
    resetGuardianForm();
  }

  showSupAddForm.value = false;
  showGuardianEditForm.value = !showGuardianEditForm.value;
};

const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      if (showGuardianEditForm.value) {
        guardianZipCode.value = data.zonecode;
        guardianMainAddress.value = data.roadAddress;
      } else {
        zipCode.value = data.zonecode;
        mainAddress.value = data.roadAddress;
        detailRef.value?.$el?.querySelector("input")?.focus();
      }
    },
  }).open();
};

const getMajorList = async () => {
  try {
    const resp = await fetch("/api/dis/disList");
    const data = await resp.json();
    majorList.value = data;
  } catch (err) {
    console.error("대분류 조회 실패", err);
  }
};

const getMiddleList = async () => {
  try {
    if (!supInfo.major.length) {
      middleList.value = [];
      supInfo.middle = [];
      return;
    }

    const queryString = supInfo.major
      .map((code) => `bCodes=${encodeURIComponent(code)}`)
      .join("&");

    const result = await fetch(`/api/dis/disMidList?${queryString}`)
      .then((resp) => resp.json())
      .catch((err) => console.log(err));

    middleList.value = result;
    supInfo.middle = [];
  } catch (err) {
    console.log(err);
  }
};

const onChangeMajor = async () => {
  await getMiddleList();
};

const getSupList = async (loginIno) => {
  const result = await fetch(`/api/user/support/supList/${loginIno}`)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

  supList.value = result;
};

const getGuardianInfo = async (userId) => {
  const result = await fetch(`/api/user/info/${userId}`)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

  console.log(result);

  if (result.status === "Success") {
    guardianInfo.GuserId = result.data.GUSERID || "";
    guardianInfo.userId = result.data.id || "";
    guardianInfo.name = result.data.name || "";
    guardianInfo.tel = result.data.tel || "";
    guardianInfo.email = result.data.email || "";
    guardianInfo.address = result.data.address || "";
    guardianInfo.institution = result.data.institution || "";
    guardianInfo.institution_id = result.data.institution_id || "";

    await getSupList(guardianInfo.GuserId);
  } else {
    alert(result.message || "사용자 정보 조회 실패");
  }
};

const addSupport = async () => {
  const data = {
    G_UserId: guardianInfo.GuserId,
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

  const result = await fetch("/api/user/support/add", {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  }).then((resp) => resp.json());

  if (result.status == "Success") {
    await getSupList(data.G_UserId);
    alert("등록이 성공하였습니다.");
    resetSupForm();
  } else {
    alert("등록이 실패하였습니다.");
  }
};

const updateSupport = async (supId) => {
  const data = {
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

  const result = await fetch(`/api/user/support/${supId}`, {
    method: "put",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

  if (result.status === "Success") {
    await getSupList(supInfo.G_UserId);
    alert("수정이 성공하였습니다.");
  } else {
    alert("수정이 실패하였습니다.");
  }
};

const deleteSupport = async (supId) => {
  const result = await fetch(`/api/user/support/${supId}`, {
    method: "delete",
  })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

  if (result.status === "Success") {
    await getSupList(supInfo.G_UserId);
    alert("삭제되었습니다.");
    resetSupForm();
    showSupAddForm.value = false;
  } else {
    alert("삭제가 실패하였습니다.");
  }
};

const editSup = async (item) => {
  showGuardianEditForm.value = false;
  showSupAddForm.value = true;
  isEdit.value = true;

  supInfo.support_id = item.support_id || "";
  supInfo.G_UserId = item.G_UserId || "";
  supInfo.I_userId1 = item.I_userId1 || null;
  supInfo.I_userId2 = item.I_userId2 || null;
  supInfo.name = item.name || "";
  supInfo.born = item.born ? item.born.slice(0, 10) : "";
  supInfo.gender = item.gender || "";
  supInfo.relation = item.relation || "";
  supInfo.sub = item.sub || "";
  supInfo.major = item.major ? item.major.split(",").map((v) => v.trim()) : [];

  await getMiddleList();

  supInfo.middle = item.middle ? item.middle.split(",").map((v) => v.trim()) : [];

  zipCode.value = item.zipCode || "";
  mainAddress.value = item.address || "";
  detailAddress.value = "";
};

const onGuardianFileChange = (event, key) => {
  const file = event.target.files?.[0] || null;
  guardianEditInfo[key] = file;
};

const saveGuardianInfo = async () => {
  const formData = new FormData();

  formData.append("institution_id", guardianEditInfo.institution_id);
  formData.append("name", guardianEditInfo.name);
  formData.append("id", guardianEditInfo.userId);
  formData.append("tel", guardianEditInfo.tel);
  formData.append("email", guardianEditInfo.email);
  formData.append("zipCode", guardianZipCode.value);
  formData.append(
    "address",
    `${guardianMainAddress.value} ${guardianDetailAddress.value}`.trim()
  );

  if (guardianEditInfo.file1) {
    formData.append("document1", guardianEditInfo.file1);
  }

  if (guardianEditInfo.file2) {
    formData.append("document2", guardianEditInfo.file2);
  }

  const result = await fetch(`/api/user/info`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  }).then((res) => res.json());

  if (result.status === "Success") {
    alert("회원정보가 수정되었습니다.");
  } else {
    alert(result.message || "회원정보 수정 실패");
  }
};

const changePassword = async () => {
  if (!guardianEditInfo.currentPassword || !guardianEditInfo.currentPassword.trim()) {
    alert("현재 비밀번호를 입력하세요.");
    return;
  }

  if (!guardianEditInfo.newPassword || !guardianEditInfo.newPassword.trim()) {
    alert("새 비밀번호를 입력하세요.");
    return;
  }

  if (guardianEditInfo.newPassword !== guardianEditInfo.newPasswordConfirm) {
    alert("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
    return;
  }

  const result = await fetch("/api/user/password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      currentPassword: guardianEditInfo.currentPassword,
      newPassword: guardianEditInfo.newPassword,
      newPasswordConfirm: guardianEditInfo.newPasswordConfirm,
    }),
  }).then((res) => res.json());

  if (result.status === "Success") {
    alert("비밀번호가 변경되었습니다.");
    guardianEditInfo.currentPassword = "";
    guardianEditInfo.newPassword = "";
    guardianEditInfo.newPasswordConfirm = "";
  } else {
    alert(result.message || "비밀번호 변경 실패");
  }
};

const cancelGuardianEdit = () => {
  showGuardianEditForm.value = false;
};

const selectedMajorNames = computed(() => {
  return majorList.value
    .filter((item) => supInfo.major.includes(item.b_Code))
    .map((item) => item.description);
});

const selectedMiddleNames = computed(() => {
  return middleList.value
    .filter((item) => supInfo.middle.includes(item.j_Code))
    .map((item) => item.description);
});
</script>

<template>
  <main>
    <RoleHeader />

    <div class="py-4 container-fluid">
      <div class="row align-items-stretch">
        <div class="col-md-4 d-flex">
          <div class="row g-0 h-100">
            <!-- 좌측 보호자 정보 -->
            <div class="col-6">
              <div class="card h-100 rounded-0 border border-secondary">
                <div class="card-header pb-0 border-bottom">
                  <h6 class="mb-1 text-dark">보호자</h6>
                  <p class="text-sm mb-2">{{ guardianInfo.name }}님의 정보</p>
                </div>

                <div class="card-body p-0 d-flex flex-column">
                  <div
                    class="border-bottom d-flex flex-column justify-content-center px-3"
                    style="height: 69px"
                  >
                    <div class="text-sm">아이디</div>
                    <div class="fw-bold">{{ guardianInfo.userId }}</div>
                  </div>

                  <div
                    class="border-bottom d-flex flex-column justify-content-center px-3"
                    style="height: 70px"
                  >
                    <div class="text-sm">연락처</div>
                    <div class="fw-bold">{{ guardianInfo.tel }}</div>
                  </div>

                  <div
                    class="border-bottom d-flex flex-column justify-content-center px-3"
                    style="height: 70px"
                  >
                    <div class="text-sm">이메일</div>
                    <div class="fw-bold text-decoration-underline">
                      {{ guardianInfo.email }}
                    </div>
                  </div>

                  <div
                    class="border-bottom d-flex flex-column justify-content-center px-3"
                    style="height: 70px"
                  >
                    <div class="text-sm">주소</div>
                    <div class="text-sm">{{ guardianInfo.address }}</div>
                  </div>

                  <div class="p-2">
                    <div class="text-sm">등록된 기관명</div>
                    <div class="text-sm">{{ guardianInfo.institution }}</div>
                  </div>

                  <div class="mt-auto p-2">
                    <argon-button
                      color="secondary"
                      class="w-100"
                      @click="toggleGuardianForm"
                    >
                      {{ showGuardianEditForm ? "닫기" : "내 정보 수정" }}
                    </argon-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 좌측 지원대상자 목록 -->
            <div class="col-6">
              <div class="card h-100 rounded-0 border border-secondary border-start-0">
                <div class="card-header text-center border-bottom">
                  <h6 class="mb-2 fw-bold">지원 대상자 목록</h6>
                </div>

                <div class="card-body p-0 d-flex flex-column">
                  <template v-if="supList.length">
                    <div
                      v-for="item in supList"
                      :key="item.support_id"
                      class="d-flex justify-content-between align-items-center px-3 border-bottom"
                      style="height: 70px"
                    >
                      <span>{{ item.name }}</span>
                      <argon-button size="sm" color="dark" @click="editSup(item)">
                        수정
                      </argon-button>
                    </div>
                  </template>

                  <div v-else class="text-center p-3 text-sm text-muted">
                    등록된 대상자가 없습니다.
                  </div>

                  <div class="mt-auto p-2 position-relative">
                    <argon-button color="secondary" class="w-100" @click="toggleSupForm">
                      {{ showSupAddForm ? "닫기" : "지원 대상자 등록" }}
                    </argon-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 우측 폼 영역 -->
        <div class="col-md-8">
          <div class="card h-100 rounded-0 border border-secondary border-start-0">
            <!-- 보호자 정보 수정 폼 -->
            <div v-if="showGuardianEditForm">
              <div class="card-header pb-0">
                <div class="d-flex align-items-center">
                  <p class="mb-0 fw-bold">{{ guardianInfo.name }}님의 정보</p>
                </div>
              </div>

              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <label class="form-control-label">이름</label>
                    <argon-input type="text" v-model="guardianEditInfo.name" />
                  </div>

                  <div class="col-md-12">
                    <label class="form-control-label">아이디</label>
                    <div class="form-control bg-light">
                      {{ guardianEditInfo.userId }}
                    </div>
                  </div>

                  <div class="col-md-12">
                    <label class="form-control-label">현재 비밀번호</label>
                    <argon-input
                      type="password"
                      v-model="guardianEditInfo.currentPassword"
                    />
                  </div>

                  <div class="col-md-12">
                    <label class="form-control-label">새 비밀번호</label>
                    <argon-input type="password" v-model="guardianEditInfo.newPassword" />
                  </div>

                  <div class="col-md-12">
                    <label class="form-control-label">새 비밀번호 확인</label>
                    <argon-input
                      type="password"
                      v-model="guardianEditInfo.newPasswordConfirm"
                    />
                  </div>

                  <div class="col-md-12 mb-2">
                    <argon-button color="dark" size="sm" @click="changePassword">
                      비밀번호 변경
                    </argon-button>
                  </div>

                  <div class="col-md-12">
                    <label class="form-control-label">연락처</label>
                    <argon-input type="text" v-model="guardianEditInfo.tel" />
                  </div>

                  <div class="col-md-12">
                    <label class="form-control-label">주소</label>

                    <div class="row g-2 mb-2">
                      <div class="col-md-12 d-flex gap-2">
                        <div style="width: 140px">
                          <argon-input
                            class="mb-0"
                            type="text"
                            v-model="guardianZipCode"
                            placeholder="우편번호"
                            readonly
                          />
                        </div>

                        <argon-button class="mb-0 px-3" @click="openPostcode">
                          주소 검색
                        </argon-button>
                      </div>
                    </div>

                    <div class="row g-2">
                      <div class="col-md-6">
                        <argon-input
                          class="mb-0"
                          type="text"
                          v-model="guardianMainAddress"
                          placeholder="기본주소"
                          readonly
                        />
                      </div>

                      <div class="col-md-6">
                        <argon-input
                          class="mb-0"
                          type="text"
                          v-model="guardianDetailAddress"
                          placeholder="상세주소 입력"
                        />
                      </div>
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
                      <argon-button color="dark" size="sm" @click="openInstitutionModal"
                        >기관 검색</argon-button
                      >
                    </div>
                  </div>

                  <div class="col-md-12 mt-3">
                    <label class="form-control-label">증빙서류</label>

                    <div class="d-flex align-items-center gap-2 flex-wrap mb-2">
                      <input
                        type="file"
                        class="form-control"
                        @change="(e) => onGuardianFileChange(e, 'file1')"
                      />
                    </div>

                    <div class="d-flex align-items-center gap-2 flex-wrap">
                      <input
                        type="file"
                        class="form-control"
                        @change="(e) => onGuardianFileChange(e, 'file2')"
                      />
                    </div>
                  </div>

                  <div class="col-md-12 mt-3">
                    <argon-input
                      type="text"
                      v-model="guardianEditInfo.joinDate"
                      readonly
                    />
                  </div>

                  <div class="col-md-6 mt-3">
                    <argon-button color="success" class="w-100" @click="saveGuardianInfo">
                      수정
                    </argon-button>
                  </div>

                  <div class="col-md-6 mt-3">
                    <argon-button
                      color="secondary"
                      class="w-100"
                      @click="cancelGuardianEdit"
                    >
                      취소
                    </argon-button>
                  </div>

                  <div class="col-md-12 mt-3 text-end">
                    <argon-button color="danger" size="sm">회원 탈퇴</argon-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 지원 대상자 등록/수정 폼 -->
            <div v-else-if="showSupAddForm">
              <div class="card-header pb-0">
                <div class="d-flex align-items-center">
                  <p class="mb-0">
                    {{ isEdit ? "지원 대상자 수정" : "지원 대상자 등록" }}
                  </p>
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
                    />
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
                        v-model="supInfo.relation"
                      />
                      <label for="parent">부모</label>

                      <input
                        type="radio"
                        id="child"
                        name="rel"
                        value="d002"
                        v-model="supInfo.relation"
                      />
                      <label for="child">자녀</label>

                      <input
                        type="radio"
                        id="prod"
                        name="rel"
                        value="d003"
                        v-model="supInfo.relation"
                      />
                      <label for="prod">요양보호사</label>
                    </div>
                  </div>
                </div>

                <hr class="horizontal dark" />
                <p class="text-uppercase text-sm">Contact Information</p>

                <div class="row">
                  <div class="col-md-12">
                    <label class="form-control-label">주소</label>

                    <div class="row g-2 mb-2">
                      <div class="col-md-12 d-flex gap-2">
                        <div style="width: 140px">
                          <argon-input
                            class="mb-0"
                            type="text"
                            readOnly
                            v-model="zipCode"
                            placeholder="우편번호"
                            isRequired
                          />
                        </div>

                        <argon-button class="mb-0 px-3" @click="openPostcode">
                          주소 검색
                        </argon-button>
                      </div>
                    </div>

                    <div class="row g-2">
                      <div class="col-md-6">
                        <argon-input
                          class="mb-0"
                          type="text"
                          v-model="mainAddress"
                          placeholder="기본주소"
                          readonly
                          isRequired
                        />
                      </div>

                      <div class="col-md-6">
                        <argon-input
                          class="mb-0"
                          type="text"
                          v-model="detailAddress"
                          placeholder="상세주소 입력"
                          ref="detailRef"
                          isRequired
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12">
                    <label for="major" class="form-control-label mt-3">장애유형</label>
                  </div>
                </div>

                <div class="row g-2">
                  <div class="col">
                    <select
                      class="form-select"
                      multiple
                      v-model="supInfo.major"
                      @change="onChangeMajor"
                    >
                      <option disabled value="">대분류선택</option>
                      <option
                        v-for="item in majorList"
                        :key="item.b_Code"
                        :value="item.b_Code"
                      >
                        {{ item.description }}
                      </option>
                    </select>
                  </div>

                  <div class="col">
                    <select class="form-select" multiple v-model="supInfo.middle">
                      <option disabled value="">중분류선택</option>
                      <option
                        v-for="item in middleList"
                        :key="item.j_Code"
                        :value="item.j_Code"
                      >
                        {{ item.description }}
                      </option>
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

                <div class="mt-2">
                  <small class="text-muted">
                    선택된 대분류:
                    {{ selectedMajorNames.join(", ") || "없음" }}
                  </small>
                </div>

                <div class="mt-1">
                  <small class="text-muted">
                    선택된 중분류:
                    {{ selectedMiddleNames.join(", ") || "없음" }}
                  </small>
                </div>

                <hr class="horizontal dark" />

                <div class="row">
                  <div class="col-md-12" v-if="!isEdit">
                    <argon-button class="w-100 mb-0 py-3" @click="addSupport">
                      등록
                    </argon-button>
                  </div>

                  <template v-else>
                    <div class="col-md-6">
                      <argon-button
                        class="w-100 mb-0 py-3"
                        color="info"
                        @click="updateSupport(supInfo.support_id)"
                      >
                        수정
                      </argon-button>
                    </div>

                    <div class="col-md-6">
                      <argon-button
                        class="w-100 mb-0 py-3"
                        color="danger"
                        @click="deleteSupport(supInfo.support_id)"
                      >
                        삭제
                      </argon-button>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- 초기 빈 화면 -->
            <div v-else class="h-100 d-flex align-items-center justify-content-center">
              <p class="text-muted mb-0">왼쪽에서 작업을 선택하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div
    v-if="showInstitutionModal"
    class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
    style="background-color: rgba(0, 0, 0, 0.45); z-index: 2000"
  >
    <div class="card shadow-lg" style="width: 700px; max-width: 90%">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h6 class="mb-0">기관 검색</h6>
        <button type="button" class="btn-close" @click="closeInstitutionModal"></button>
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
              <option v-for="item in sidoList" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </div>

          <div class="col-md-4">
            <label class="form-control-label">구 / 군</label>
            <select class="form-select" v-model="institutionSearch.sigungu">
              <option value="">선택</option>
              <option v-for="item in sigunguList" :key="item" :value="item">
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
          <argon-button color="secondary" class="me-2" @click="closeInstitutionModal">
            닫기
          </argon-button>
          <argon-button color="dark" @click="searchInstitution"> 검색 </argon-button>
        </div>

        <hr />

        <div style="max-height: 300px; overflow-y: auto">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th class="text-secondary text-xs font-weight-bolder opacity-7">
                  기관명
                </th>
                <th class="text-secondary text-xs font-weight-bolder opacity-7">주소</th>
                <th
                  class="text-secondary text-xs font-weight-bolder opacity-7 text-center"
                >
                  선택
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!institutionList.length">
                <td colspan="3" class="text-center text-muted py-3">
                  검색 결과가 없습니다.
                </td>
              </tr>

              <tr v-for="item in institutionList" :key="item.institution_id">
                <td>{{ item.institution_name }}</td>
                <td>{{ item.address }}</td>
                <td class="text-center">
                  <argon-button size="sm" color="info" @click="selectInstitution(item)">
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
</template>
