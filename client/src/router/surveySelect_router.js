export default [
  {
    //일반이용자 조사지 등록 Router
    path: "/user/surveyselect",
    name: "userSurveySelect",
    component: () => import("../views/surveySelect.vue"),
    meta: { hideNavbar: true }, // 이 페이지에서만 고정 상단바 취소
  },
  {
    //기관 담당자, 기관 관리자 조사지 조회 Router
    path: "/manager/managerselect",
    name: "managerSelect",
    component: () => import("../views/managerSelect.vue"),
    meta: { hideNavbar: true }, // 이 페이지에서만 고정 상단바 취소
  },
];
