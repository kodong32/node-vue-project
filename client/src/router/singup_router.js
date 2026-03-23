export default [
  {
    //일반 사용자 회원가입
    path: "/user/signup",
    name: "userSignup",
    component: () => import("../views/Signup.vue"), //해당 path로 이동 시 출력될 component
  },
  {
    //기관 사용자 회원가입
    path: "/insti/signup",
    name: "instiSignup",
    component: () => import("../views/InstiUserSignup.vue"), //해당 path로 이동 시 출력될 component
    //기관담당자, 기관관리자 회원가입페이지로 변경 (../views/Signup.vue -> ../views/InstiSignup.vue)
  },
];
