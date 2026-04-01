export default [
  {
    //기관담당자 마이페이지 Router
    path : '/manager/:userId/mypage',
    name: '/mngMypage',
    component: () => import('../views/managerProfile.vue') 
  },
]