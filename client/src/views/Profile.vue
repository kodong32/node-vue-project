<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUnmount, reactive, computed } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import MyPageHeader from "./components/myPageHeader.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userId = route.params.userId;

const body = document.getElementsByTagName("body")[0];

const store = useStore();
const zipCode = ref("");
const detailRef = ref(null);
const mainAddress = ref("");
const detailAddress = ref("");
const majorList = ref([]);
const middleList = ref([]);

const showSupAddForm = ref(false);
const isEdit = ref(false);
const supList = ref([]);

const guardianInfo = reactive({
  GuserId: "",
  userId: "",
  name: "",
  tel: "",
  email: "",
  address: "",
  institution: "",
});

const supInfo = reactive({
  G_UserId: userId, //현재 테스트를 위한 하드코딩상태임 Session 추가 시 변경예정 26.03.24
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
  getMajorList(); // 대분류 장애코드 호출
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

const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      zipCode.value = data.zonecode;
      mainAddress.value = data.roadAddress;
      detailRef.value.$el.querySelector("input").focus();
    },
  }).open();
};

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

const toggleSupForm = () => {
  if (!showSupAddForm.value) {
    isEdit.value = false;
    resetSupForm();
    supInfo.G_UserId = userId;
  }

  showSupAddForm.value = !showSupAddForm.value;
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
    //대분류선택없으면 중분류 초기화
    if (!supInfo.major.length) {
      middleList.value = [];
      supInfo.middle = [];
      return;
    }

    //쿼리문 ?에 들어갈 내용 parsing
    const queryString = supInfo.major
      .map((code) => `bCodes=${encodeURIComponent(code)}`)
      .join("&");

    let result = await fetch(`/api/dis/disMidList?${queryString}`)
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
  let result = await fetch(`/api/user/support/supList/${loginIno}`)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

  supList.value = result;
  console.log(supList.value);
};

const getGuardianInfo = async (userId) => {
  let result = await fetch(`/api/user/info/${userId}`)
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

    await getSupList(guardianInfo.GuserId);

  } else {
    alert(result.message || "사용자 정보 조회 실패");
  }
};

const addSupport = async () => {
  let data = {
    G_UserId: userId, // Session작업되면 수정예정
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
    await getSupList(data.G_UserId);
    alert("등록이 성공하였습니다.");
    resetSupForm();
  } else {
    alert("등록이 실패하였습니다.");
  }
};

const updateSupport = async (supId) => {
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

  let result = await fetch(`/api/user/support/${supId}`, {
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
  let result = await fetch(`/api/user/support/${supId}`, {
    method: "delete",
  })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

  if (result.status === "Success") {
    await getSupList(supInfo.G_UserId);
    alert("삭제되었습니다.");
  } else {
    alert("삭제가 실패하였습니다.");
  }
};

const editSup = async (item) => {
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

  //major 분류에 따른 middle 분류가 나와야함, 비동기로 사용하지 않으면 가지고 오지 못함
  await getMiddleList();

  supInfo.middle = item.middle ? item.middle.split(",").map((v) => v.trim()) : [];

  zipCode.value = item.zipCode || "";
  mainAddress.value = item.address || "";
  detailAddress.value = ""; // 추후 item.address에서 parsing해야함
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
    <MyPageHeader />
    <div class="py-4 container-fluid">
      <div class="row align-items-stretch">
        <div class="col-md-4" style="height: 770px">
          <div class="row g-0 h-100">
            <!-- 1번 -->
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
                    v-for="item in supList"
                    :key="item.support_id"
                    class="d-flex justify-content-between align-items-center px-3 border-bottom"
                    style="height: 70px"
                  >
                    <!-- <div v-if="!supList.length" class="text-center p-3">
                      등록된 대상자가 없습니다
                    </div> -->
                    <span>{{ item.name }}</span>
                    <argon-button size="sm" color="dark" @click="editSup(item)">
                      수정
                    </argon-button>
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

        <div class="col-md-8">
          <div class="card">
            <div v-if="showSupAddForm">
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
                      @change="onChangeMajor()"
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
                    <!-- <argon-button class="w-100 mb-0 py-3" @click="addSupport()">
                      등록
                    </argon-button> -->
                    <argon-button class="w-100 mb-0 py-3" @click="addSupport()">
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
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
