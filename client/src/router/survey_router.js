export default [
  {
    //일반이용자 조사지 등록 Router
    path: "/user/surveyadd",
    name: "userSurveyAdd",
    component: () => import("../views/survey.vue"),
    meta: { hideNavbar: true }, // 이 페이지에서만 고정 상단바 취소
  },
];
