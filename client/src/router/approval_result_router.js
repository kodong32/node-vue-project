// D:\node-vue-project\client\src\router\approval_result_router.js
export default [
  {
    path: "/general/approval/result",
    name: "GeneralApprovalResult",
    component: () => import("../views/components/ApprovalResultList.vue"),
    meta: { hideNavbar: true },
  },
];
