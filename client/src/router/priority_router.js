// priority_router.js 우선순위 요청

export default [
  {
    path: "/manager/priority-request/:id",
    name: "PriorityRequest",
    component: () => import("../views/PriorityRequest.vue"),
  },
  {
    path: "/general/priority-approval/:id",
    name: "PriorityApproval",
    component: () => import("../views/PriorityApproval.vue"),
  },
];
