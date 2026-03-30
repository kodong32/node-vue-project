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
  //담당자 지정 페이지 router(김경환 20260330)
  {
    path: "/general/select-manager/:id",
    name: "SelectManager",
    component: () => import("../views/SelectManager.vue"),
  },
];
