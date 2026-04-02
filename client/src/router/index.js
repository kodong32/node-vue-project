import { createRouter, createWebHistory } from "vue-router";
import Login from "./signin_router";
import Signup from "./singup_router";
import Support from "./support_router";
import Main from "./surveyList_router";
import SurveyAdd from "./survey_router";
import surveySelect from "./surveySelect_router";
import adminRouter from "./admin_router";
import supInsert from "./supPlanmanager_router";
import { useAdminAuthStore } from "@/stores/counter"; //admin Auth 사용 session 26.03.26 고동현 추가
import priority from "./priority_router";
import axios from "axios";
import Consult from "./consult_router";
import ConsultAdd from "./consultInsert_router";
import GeneralPlan from "./general_plan_router";
import RejectedList from "./rejectedList_router";
import ApprovalPlan from "./approval_plan_router";
import ResultPlanWrite from "./result_plan_router";
import ApprovalResult from "./approval_result_router";
import Notice from "./notice_router";
import managerMypage from "./mngMypage_router";
import generalMypage_router from "./generalMypage_router";
import general_managerInfo_router from "./general_managerInfo_router";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/user/login",
  },
  ...Login,
  ...Signup,
  ...Support,
  ...Main,
  ...SurveyAdd,
  ...surveySelect,
  ...adminRouter,
  ...priority,
  ...supInsert,
  ...Consult,
  ...ConsultAdd,
  ...GeneralPlan,
  ...RejectedList,
  ...ApprovalPlan,
  ...ResultPlanWrite,
  ...ApprovalResult,
  ...Notice,
  ...managerMypage,
  ...generalMypage_router,
  ...general_managerInfo_router,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

// client router gaurd
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

  //일반 회원 마이페이지 route check
  if (
    to.path.startsWith("/user") &&
    to.path !== "/user/login" &&
    to.path !== "/user/ilogin" &&
    to.path !== "/user/signup"
  ) {
    try {
      const response = await axios.get("/api/user/session-check");
      const result = response.data;

      if (!result.isLogin) {
        alert("로그인이 필요합니다.");
        return next("/user/login");
      }

      const loginUserId = result.user.id;
      const urlUserId = to.params.userId;

      if (urlUserId && loginUserId !== urlUserId) {
        alert("본인 페이지에만 접근할 수 있습니다.");
        return next(`/${loginUserId}/mypage/support`);
      }
    } catch (err) {
      console.log("일반회원 가드 오류", err);
      return next("/user/login");
    }
  }

  //기관 회원 route check
  if (to.path.startsWith("/manager") || to.path.startsWith("/general")) {
    try {
      const response = await axios.get("/api/user/isession-check");
      const result = response.data;

      if (!result.isLogin) {
        alert("기관 회원 로그인이 필요합니다.");
        return next("/user/login");
      }
      const role = result.user.role;

      if (role !== "a002" && role !== "a003") {
        alert("기관 회원 권한이 없습니다.");
        return next("/user/login");
      }
      const loginUserId = result.user.id;
      const urlUserId = to.params.userId;

      if (urlUserId && loginUserId !== urlUserId) {
        alert("본인 페이지에만 접근할 수 있습니다.");
        if (role == "a002") {
          return next(`/general/${loginUserId}/mypage`);
        }
        if (role == "a003") {
          return next(`/manager/${loginUserId}/mypage`);
        }
      }
    } catch (err) {
      console.log("기관 회원 가드 오류", err);
      return next("/user/login");
    }
  }

  if (to.path.startsWith("/notice")) {
    try {
      // 팀장님이 만든 통합 세션 확인 API 호출
      const response = await axios.get("/api/user/auth/me", {
        withCredentials: true, // 여기서도 쿠키 전송 필수!
      });

      const result = response.data;

      // 로그인을 안 했으면 무조건 쫓아냄
      if (!result.isLogin) {
        alert("공지사항을 보려면 로그인이 필요합니다.");
        return next("/user/login"); // 로그인 페이지로 이동
      }

      // 로그인을 했다면, 권한 따지지 않고 무조건 통과!
      // (글쓰기/수정 권한은 화면단 Vue 파일에서 버튼을 숨기는 방식으로 통제함)
    } catch (err) {
      console.log("공지사항 가드 오류", err);
      return next("/user/login");
    }
  }

  next();
});

export default router;
