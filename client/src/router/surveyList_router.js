// surveyList_router.js
export default [
  {
    //일반이용자 조사지 리스트 Router
    path: "/user",
    name: "userMain",
    component: () => import("../views/UserMain.vue"),
    meta: {
      hideNavbar: true,
      sidebar: "userMain"
    },
  },
  {
    //기관담당자 조사지 리스트 Router
    path: "/manager",
    name: "managerMain",
    component: () => import("../views/ManagerMain.vue"),
    meta: {
      hideNavbar: true,
      sidebar: "managerMain",
    },
  },
  {
    //기관관리자 조사지 리스트 Router
    path: "/general",
    name: "generalMain",
    component: () => import("../views/GeneralMain.vue"),
    meta: {
      hideNavbar: true,
      sidebar: "generalMain",
    },
  },
  {
    path: "/survey/detail/:id",
    name: "surveySearch",
    component: () => import("../views/components/surveySelectCard.vue"),
    meta: { hideNavbar: true },
  },
  //기관관리자 회원가입 승인 Router(김경환 20260331)
  {
    path: "/general/approval",
    component: () => import("../views/components/InstiAdminApproval.vue"),
    meta: { hideNavbar: true },
  },
];
