export default [
  {
    //일반이용자 조사지 등록 Router
    path: "/user/surveyadd",
    name: "userSurveyAdd",
    component: () => import("../views/survey.vue"),
  },
];
