export default [
  {
    //일반이용자 로그인
    path: "/user/login",
    name: "userLogin",
    component: () => import("../views/Signin.vue"), //해당 path로 이동 시 출력될 component
    meta: { hideNavbar: true },
  },
  {
    //기관직원 로그인
    path: "/user/ilogin",
    name: "instiLogin",
    component: () => import("../views/InstiSignin.vue"), //해당 path로 이동 시 출력될 component
    meta: { hideNavbar: true },
  },
];
