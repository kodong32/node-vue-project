<script setup>
import { ref, reactive, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import RoleHeader from "./components/RoleHeader.vue";

import ManagerInfoCard from "./components/managerInfoCard.vue";
import ManagerInfoView from "./components/managerInfoView.vue";
import ManagerEditForm from "./components/ManagerEditForm.vue";
import SupportList from "./components/SupportList.vue";
import SupportDetail from "./components/SupportDetail.vue";

const store = useStore();
const body = document.getElementsByTagName("body")[0];

const currentMode = ref("info"); // info | edit | detail
const selectedSupportId = ref("");

const managerInfo = reactive({
  I_UserId: "",
  userId: "",
  name: "",
  tel: "",
  institution: "",
  institution_id: "",
});

const managerEditInfo = reactive({
  I_UserId: "",
  userId: "",
  name: "",
  tel: "",
  email: "",
  institution: "",
  institution_id: "",
  joinDate: "",
});

const supList = ref([]);

const supportDetail = reactive({
  support_id: "",
  G_UserId: "",
  I_UserId1: "",
  I_UserId2: "",
  born: "",
  gender: "",
  relation: "",
  major: "",
  middle: "",
  sub: "",
  chargeType: "",

  support_name: "",
  support_zipCode: "",
  support_address: "",

  guardian_name: "",
  guardian_id: "",
  guardian_tel: "",
  guardian_email: "",
  guardian_zipCode: "",
  guardian_address: "",
  guardian_approval: "",
  guardian_institution_id: "",
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
  await getManagerInfo();
  await getSupportList();
});

const getManagerInfo = async () => {
  try {
    const result = await fetch("/api/user/instiUsersinfo", {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());

    if (result.status === "Success") {
      const data = result.data || {};

      managerInfo.I_UserId = data.I_UserId || "";
      managerInfo.userId = data.id || "";
      managerInfo.name = data.name || "";
      managerInfo.tel = data.tel || "";
      managerInfo.institution = data.institution || "";
      managerInfo.institution_id = data.institution_id || "";

      resetManagerEditInfo();
    } else {
      alert(result.message || "기관 담당자 정보 조회 실패");
    }
  } catch (err) {
    console.log("getManagerInfo error :", err);
    alert("기관 담당자 정보 조회 중 오류");
  }
};

const resetManagerEditInfo = () => {
  managerEditInfo.I_UserId = managerInfo.I_UserId;
  managerEditInfo.userId = managerInfo.userId;
  managerEditInfo.name = managerInfo.name;
  managerEditInfo.tel = managerInfo.tel;
  managerEditInfo.institution = managerInfo.institution;
  managerEditInfo.institution_id = managerInfo.institution_id;
};

const getSupportList = async () => {
  try {
    const result = await fetch("/api/user/instiSupportList", {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());

    console.log("담당 지원 대상자 목록 :", result);

    if (result.status === "Success") {
      supList.value = result.data || [];
    } else {
      supList.value = [];
      alert(result.message || "담당 지원 대상자 목록 조회 실패");
    }
  } catch (err) {
    console.log("getSupportList error :", err);
    supList.value = [];
  }
};

const openMyInfo = () => {
  currentMode.value = "info";
};

const openMyEdit = () => {
  resetManagerEditInfo();
  currentMode.value = "edit";
};

const showSupportDetail = (item) => {
  const data = item || {};

  selectedSupportId.value = data.support_id || "";
  currentMode.value = "detail";

  supportDetail.support_id = data.support_id || "";
  supportDetail.G_UserId = data.G_UserId || "";
  supportDetail.I_UserId1 = data.I_UserId1 || "";
  supportDetail.I_UserId2 = data.I_UserId2 || "";
  supportDetail.born = data.born || "";
  supportDetail.gender = data.gender || "";
  supportDetail.relation = data.relation || "";
  supportDetail.major = data.major || "";
  supportDetail.middle = data.middle || "";
  supportDetail.sub = data.sub || "";
  supportDetail.chargeType = data.chargeType || "";

  supportDetail.support_name = data.support_name || "";
  supportDetail.support_zipCode = data.support_zipCode || "";
  supportDetail.support_address = data.support_address || "";

  supportDetail.guardian_name = data.guardian_name || "";
  supportDetail.guardian_id = data.guardian_id || "";
  supportDetail.guardian_tel = data.guardian_tel || "";
  supportDetail.guardian_email = data.guardian_email || "";
  supportDetail.guardian_zipCode = data.guardian_zipCode || "";
  supportDetail.guardian_address = data.guardian_address || "";
  supportDetail.guardian_approval = data.guardian_approval || "";
  supportDetail.guardian_institution_id = data.guardian_institution_id || "";
};

const saveManagerInfo = async (form) => {
  try {
    const result = await fetch("/api/user/instiUsersinfo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(form),
    }).then((res) => res.json());

    if (result.status === "Success") {
      alert("수정 완료");
      await getManagerInfo();
      currentMode.value = "info";
    } else {
      alert(result.message || "수정 실패");
    }
  } catch (err) {
    console.log("saveManagerInfo error :", err);
    alert("수정 중 오류");
  }
};

const changePassword = async (payload) => {
  try {
    const result = await fetch("/api/user/instiUsersPassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (result.status === "Success") {
      alert("비밀번호가 변경되었습니다.");
    } else {
      alert(result.message || "비밀번호 변경 실패");
    }
  } catch (err) {
    console.log("changePassword error :", err);
    alert("비밀번호 변경 중 오류");
  }
};

const cancelEdit = () => {
  currentMode.value = "info";
};
</script>

<template>
  <main class="manager-page">
    <RoleHeader />

    <div class="container-fluid py-4">
      <div class="row g-0 manager-layout">
        <!-- 좌측 -->
        <div class="col-xl-2 col-lg-3 col-md-12">
          <ManagerInfoCard :info="managerInfo" @info="openMyInfo" @edit="openMyEdit" />
        </div>

        <!-- 최초 화면 -->
        <template v-if="currentMode === 'info'">
          <div class="col-xl-5 col-lg-5 col-md-12">
            <ManagerInfoView :info="managerInfo" />
          </div>

          <div class="col-xl-5 col-lg-4 col-md-12">
            <SupportList
              title="담당 지원 대상자 목록"
              :list="supList"
              @select="showSupportDetail"
            />
          </div>
        </template>

        <!-- 수정 화면 -->
        <template v-else-if="currentMode === 'edit'">
          <div class="col-xl-5 col-lg-5 col-md-12">
            <ManagerEditForm
              :data="managerEditInfo"
              @save="saveManagerInfo"
              @change-password="changePassword"
              @cancel="cancelEdit"
            />
          </div>

          <div class="col-xl-5 col-lg-4 col-md-12">
            <SupportList
              title="담당 지원 대상자 목록"
              :list="supList"
              @select="showSupportDetail"
            />
          </div>
        </template>

        <!-- 상세 화면 -->
        <template v-else-if="currentMode === 'detail'">
          <div class="col-xl-3 col-lg-4 col-md-12">
            <SupportList
              title="담당 지원 대상자 목록"
              :list="supList"
              :selected-id="selectedSupportId"
              @select="showSupportDetail"
            />
          </div>

          <div class="col-xl-7 col-lg-5 col-md-12">
            <SupportDetail :data="supportDetail" />
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<style scoped>
.manager-page {
  min-height: 100vh;
}

.manager-layout {
  border: 1px solid #dcdfe6;
  background: #fff;
}

@media (max-width: 991px) {
  .manager-layout {
    border: none;
    background: transparent;
  }
}
</style>