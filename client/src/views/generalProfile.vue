<script setup>
import { ref, reactive, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import RoleHeader from "./components/RoleHeader.vue";

import GeneralInfoCard from "./components/GeneralInfoCard.vue";
import GeneralInfoView from "./components/GeneralInfoView.vue";
import GeneralEditForm from "./components/GeneralEditForm.vue";
import InstitutionInfoView from "./components/InstitutionInfoView.vue";
import InstitutionEditForm from "./components/InstitutionEditForm.vue";

const store = useStore();
const body = document.getElementsByTagName("body")[0];

/*
  home                : 첫화면 (둘 다)
  myInfo              : 관리자 정보만
  editMyInfo          : 관리자 수정만
  institutionInfo     : 기관 정보만
  editInstitutionInfo : 기관 수정만
*/
const currentMode = ref("home");

const generalInfo = reactive({
  I_UserId: "",
  userId: "",
  name: "",
  tel: "",
  institution: "",
  institution_id: "",
});

const generalEditInfo = reactive({
  I_UserId: "",
  userId: "",
  name: "",
  tel: "",
  institution: "",
  institution_id: "",
});

const institutionInfo = reactive({
  institution_id: "",
  institution_name: "",
  institution_tel: "",
  institution_zipCode: "",
  institution_address: "",
  institution_email: "",
  state: "",
  join_date: "",
});

const institutionEditInfo = reactive({
  institution_id: "",
  institution_name: "",
  institution_tel: "",
  institution_zipCode: "",
  institution_address: "",
  institution_email: "",
  state: "",
  join_date: "",
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
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  store.state.showSidenav = true;
  body.classList.remove("profile-overview");
});

onMounted(async () => {
  await getGeneralInfo();
  await getInstitutionInfo();
});

const getGeneralInfo = async () => {
  const result = await fetch("/api/user/instiUsersinfo", {
    credentials: "include",
  }).then((res) => res.json());

  if (result.status === "Success" || result.status === "Succeess") {
    const data = result.data || {};

    generalInfo.I_UserId = data.I_UserId || "";
    generalInfo.userId = data.id || "";
    generalInfo.name = data.name || "";
    generalInfo.tel = data.tel || "";
    generalInfo.institution = data.institution || "";
    generalInfo.institution_id = data.institution_id || "";

    resetGeneralEditInfo();
  }
};

const getInstitutionInfo = async () => {
  const result = await fetch("/api/user/institutionInfo", {
    credentials: "include",
  }).then((res) => res.json());

  console.log(result);

  if (result.status === "Success") {
    const data = result.data || {};

    institutionInfo.institution_id = data.institution_id || "";
    institutionInfo.institution_name = data.institution_name || "";
    institutionInfo.institution_tel = data.institution_tel || "";
    institutionInfo.institution_zipCode = data.institution_zipCode || "";
    institutionInfo.institution_address = data.institution_address || "";
    institutionInfo.institution_email = data.institution_email || "";
    institutionInfo.state = data.state || "";
    institutionInfo.join_date = data.join_date || "";

    resetInstitutionEditInfo();
  }
};

const resetGeneralEditInfo = () => {
  Object.assign(generalEditInfo, generalInfo);
};

const resetInstitutionEditInfo = () => {
  Object.assign(institutionEditInfo, institutionInfo);
};

const saveGeneralInfo = async (formData) => {
  try {
    const payload = {
      name: formData.name,
      tel: formData.tel,
      institution_id: formData.institution_id,
    };

    const result = await fetch("/api/user/instiUsersinfo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    console.log("기관 관리자 정보 수정 결과 :", result);

    if (result.status === "Success") {
      alert("내 정보가 수정되었습니다.");
      await getGeneralInfo();
      currentMode.value = "myInfo";
    } else {
      alert(result.message || "내 정보 수정 실패");
    }
  } catch (err) {
    console.log("saveGeneralInfo error :", err);
    alert("내 정보 수정 중 오류가 발생했습니다.");
  }
};


const changePassword = async (formData) => {
  try {
    const result = await fetch("/api/user/instiUsersPassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }).then((res) => res.json());

    console.log("비밀번호 변경 결과 :", result);

    if (result.status === "Success") {
      alert("비밀번호가 변경되었습니다.");
    } else {
      alert(result.message || "비밀번호 변경 실패");
    }
  } catch (err) {
    console.log(err);
    alert("비밀번호 변경 중 오류 발생");
  }
};

const openHome = () => (currentMode.value = "home");
const openMyInfo = () => (currentMode.value = "myInfo");
const openMyEdit = () => {
  resetGeneralEditInfo();
  currentMode.value = "editMyInfo";
};
const openInstitutionInfo = () => (currentMode.value = "institutionInfo");
const openInstitutionEdit = () => {
  resetInstitutionEditInfo();
  currentMode.value = "editInstitutionInfo";
};

const cancelEdit = () => {
  if (currentMode.value === "editMyInfo") currentMode.value = "myInfo";
  else if (currentMode.value === "editInstitutionInfo") currentMode.value = "institutionInfo";
  else currentMode.value = "home";
};

//기관 정보 수정 저장
// 기관 정보 수정 저장
const saveInstitutionInfo = async (formData) => {
  try {
    const payload = {
      institution_id: formData.institution_id,
      institution_name: formData.institution_name,
      institution_tel: formData.institution_tel,
      institution_zipCode: formData.institution_zipCode,
      institution_address: formData.institution_address,
      institution_email: formData.institution_email,
    };

    const result = await fetch("/api/user/insti/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    console.log("기관정보 수정 결과 :", result);

    if (result.status === "Success") {
      alert("기관 정보가 수정되었습니다.");
      await getInstitutionInfo();
      currentMode.value = "institutionInfo";
    } else {
      alert(result.message || "기관 정보 수정 실패");
    }
  } catch (err) {
    console.log("saveInstitutionInfo error :", err);
    alert("기관 정보 수정 중 오류가 발생했습니다.");
  }
};
</script>

<template>
  <main class="general-page">
    <RoleHeader />

    <div class="container-fluid py-4">
      <div class="row g-0 general-layout">
        <!-- 좌측 -->
        <div class="col-xl-2 col-lg-3 col-md-12">
          <GeneralInfoCard
            :info="generalInfo"
            @home="openHome"
            @info="openMyInfo"
            @edit="openMyEdit"
            @institution-info="openInstitutionInfo"
            @institution-edit="openInstitutionEdit"
          />
        </div>

        <!-- 첫화면 -->
        <template v-if="currentMode === 'home'">
          <div class="col-xl-5 col-lg-5 col-md-12">
            <GeneralInfoView :info="generalInfo" />
          </div>
          <div class="col-xl-5 col-lg-5 col-md-12">
            <InstitutionInfoView :info="institutionInfo" />
          </div>
        </template>

        <!-- 내 정보 보기 -->
        <template v-else-if="currentMode === 'myInfo'">
          <div class="col-xl-10 col-lg-9 col-md-12">
            <GeneralInfoView :info="generalInfo" />
          </div>
        </template>

        <!-- 내 정보 수정 -->
        <template v-else-if="currentMode === 'editMyInfo'">
          <div class="col-xl-10 col-lg-9 col-md-12">
            <GeneralEditForm
              :data="generalEditInfo"
              @save="saveGeneralInfo"
              @change-password="changePassword"
              @cancel="cancelEdit"
              @home="openHome"
            />
          </div>
        </template>

        <!-- 기관 정보 보기 -->
        <template v-else-if="currentMode === 'institutionInfo'">
          <div class="col-xl-10 col-lg-9 col-md-12">
            <InstitutionInfoView :info="institutionInfo" />
          </div>
        </template>

        <!-- 기관 정보 수정 -->
        <template v-else-if="currentMode === 'editInstitutionInfo'">
          <div class="col-xl-10 col-lg-9 col-md-12">
            <InstitutionEditForm
              :data="institutionEditInfo"
              @save="saveInstitutionInfo"
              @cancel="cancelEdit"
              @home="openHome"
            />
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<style scoped>
.general-page {
  min-height: 100vh;
}

.general-layout {
  border: 1px solid #dcdfe6;
  background: #fff;
}
</style>