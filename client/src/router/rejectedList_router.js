// 지원계획서 반려내역 조회
export default [
  {
    path: "/manager/rejected/plan",
    name: "ManagerRejectedPlanList",
    component: () => import("../views/components/RejectedPlanList.vue"),
    meta: { hideNavbar: true },
  },
  {
    path: "/general/rejected/plan",
    name: "GeneralRejectedPlanList",
    component: () => import("../views/components/RejectedPlanList.vue"),
    meta: { hideNavbar: true },
  },
];
