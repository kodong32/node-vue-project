export default [
  {
    //일반이용자 조사지 등록 Router
    path: "/user/surveyselect",
    name: "userSurveySelect",
    component: () => import("../views/surveySelect.vue"),
  },
];
