export default [
  {
    //시스템관리자 조사지 생성 Router
    path: "/admin/surveyinsert",
    name: "adminSurveyInsert",
    component: () => import("../views/surveyInsert.vue"),
    meta: { hideNavbar: true },
  },
  //시스템 관리자 로그인 Router
  {
    path: "/admin/login",
    name: "adminLogin",
    component: () => import("../views/adminSignin.vue"),
    meta: { hideNavbar: true },
  },
  //시스템 관리자 조사지 버전List Router
  {
    path: "/admin/surveylist",
    name: "adminSurveyList",
    component: () => import("../views/adminSurveyList.vue"),
    meta: { hideNavbar: true },
  },
  //시스템 관리자 조사지 버전 Detail
  {
    path: "/admin/surveydetail/:verId",
    name: "adminSurveyDetail",
    component: () => import("../views/surveyDetail.vue"),
    meta: { hideNavbar: true },
  }
];

