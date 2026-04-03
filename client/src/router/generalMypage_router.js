export default [
  {
    //기관담당자 마이페이지 Router
    path: '/general/:userId/mypage',
    name: '/generalMypage',
    component: () => import('../views/generalProfile.vue'),
    meta: { hideNavbar: true },

  },
]