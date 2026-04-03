export default [
  {
    //일반이용자 마이페이지의 지원대상자Router
    // path: '/user/mypage/support',
    path: '/:userId/mypage/support',
    name: 'userSupport',
    component: () => import('../views/Profile.vue'),
    meta: { hideNavbar: true },
  },
]