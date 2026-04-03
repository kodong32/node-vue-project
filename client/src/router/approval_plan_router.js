// 관리자 지원계획서 승인&반려
export default [
  {
    path: "/general/approval/plan",
    name: "GeneralApprovalPlan",
    component: () => import("../views/components/ApprovalPlanList.vue"),
    meta: { hideNavbar: true },
  },
];
