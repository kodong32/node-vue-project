// D:\node-vue-project\client\src\router\general_plan_router.js
export default [
  {
    // 💡 기관관리자(GENERAL) 지원계획서 리스트 Router
    path: "/general/plan",
    name: "generalPlanList",
    // 파일 경로가 views/general 폴더 안에 있다고 가정했어. 실제 저장한 경로에 맞게 맞춰줘!
    component: () => import("../views/components/GeneralPlanListMain.vue"),
  },
  {
    // 💡 일반 이용자(USER) 지원계획서 조회 Router (추가!)
    // :surveyId 라는 동적 파라미터를 주소에 아예 박아버렸어!
    path: "/user/plan/detail/:surveyId",
    name: "userPlanDetail",
    component: () => import("../views/components/GeneralPlanListMain.vue"), // 🌟 껍데기 완벽 재활용!
  },
];
