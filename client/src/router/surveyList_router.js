export default [
  {
    //일반이용자 조사지 리스트 Router
    path: '/user/main',
    name: 'userMain',
    component: () => import('../views/Tables.vue')
  },
  {
    //기관담당자 조사지 리스트 Router
    path: '/manager/main',
    name: 'managerMain',
    component: () => import('../views/Tables.vue')
  },
  {
    //기관관리자 조사지 리스트 Router
    path: '/general/main',
    name: 'generalMain',
    component: () => import('../views/Profile.vue')
  }
]