import { createRouter, createWebHistory } from "vue-router";
// import Dashboard from "../views/Dashboard.vue";
// import Tables from "../views/Tables.vue";
// import Billing from "../views/Billing.vue";
// import VirtualReality from "../views/VirtualReality.vue";
// import RTL from "../views/Rtl.vue";
// import Profile from "../views/Profile.vue";
// import Signup from "../views/Signup.vue";
// import Signin from "../views/Signin.vue";
import Login from "./signin_router";
import Signup from "./singup_router";
import Support from "./support_router";
import Main from "./surveyList_router";
import SurveyAdd from "./survey_router";
import surveySelect from "./surveySelect_router";
import adminRouter from "./admin_router";
import { useAdminAuthStore } from "@/stores/counter"; //admin Auth 사용 session 26.03.26 고동현 추가
import priority from "./priority_router";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/user",
  },
  // {
  //   path: "/",
  //   name: "/",
  //   redirect: "/dashboard-default",
  // },
  // {
  //   path: "/dashboard-default",
  //   name: "Dashboard",
  //   component: Dashboard,
  // },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   component: Tables,
  // },
  // {
  //   path: "/billing",
  //   name: "Billing",
  //   component: Billing,
  // },
  // {
  //   path: "/virtual-reality",
  //   name: "Virtual Reality",
  //   component: VirtualReality,
  // },
  // {
  //   path: "/rtl-page",
  //   name: "RTL",
  //   component: RTL,
  // },
  // {
  //   path: "/profile",
  //   name: "Profile",
  //   component: Profile,
  // },
  // {
  //   path: "/signin",
  //   name: "Signin",
  //   component: Signin,
  // },
  // {
  //   path: "/signup",
  //   name: "Signup",
  //   component: Signup,
  // },
  ...Login,
  ...Signup,
  ...Support,
  ...Main,
  ...SurveyAdd,
  ...surveySelect,
  ...adminRouter,
  ...priority,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

//관리자용 client router gaurd
router.beforeEach(async (to, from, next) => {
  const adminAuthStore = useAdminAuthStore();

  // /admin 으로 시작하고, /admin/login 은 제외
  if (to.path.startsWith("/admin") && to.path !== "/admin/login") {
    // 1. pinia 로그인 상태 없으면 세션 확인
    if (!adminAuthStore.isLoggedIn) {
      const success = await adminAuthStore.checkLogin();

      if (!success) {
        return next("/admin/login");
      }
    }

    // 2. 권한 체크
    if (!adminAuthStore.user || adminAuthStore.user.role !== "a001") {
      alert("관리자 권한이 없습니다.");
      return next("/admin/login");
    }
  }

  next();
});

export default router;
