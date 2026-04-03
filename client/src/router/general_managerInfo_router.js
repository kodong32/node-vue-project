export default [
  {
    //기관내 소속 기관 담당자 정보확인 Router
    path: "/general/managerInfo",
    name: "generalManagerInfo",
    component: () => import("../views/GeneralManagerInfo.vue"),
    meta: { hideNavbar: true },
  },
]