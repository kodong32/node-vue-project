export default [
  {
    //일반이용자 조사지 리스트 Router
    path: "/user",
    name: "userMain",
    component: () => import("../views/UserMain.vue"),
  },
  {
    //기관담당자 조사지 리스트 Router
    path: "/manager",
    name: "managerMain",
    component: () => import("../views/ManagerMain.vue"),
  },
  {
    //기관관리자 조사지 리스트 Router
    path: "/general",
    name: "generalMain",
    component: () => import("../views/GeneralMain.vue"),
  },
];
