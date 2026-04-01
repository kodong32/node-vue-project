// D:\node-vue-project\client\src\router\notice_router.js

export default [
  {
    // 💡 1. 공지사항 목록 (모두 접근 가능)
    path: "/notice/list",
    name: "NoticeList",
    // 실제 NoticeList.vue 파일이 있는 경로로 맞춰줘!
    component: () => import("../views/components/NoticeList.vue"),
  },
  {
    // 💡 2. 공지사항 상세 보기 (모두 접근 가능)
    path: "/notice/detail/:noticeId",
    name: "NoticeDetail",
    component: () => import("../views/components/NoticeList.vue"), // 다음 스텝에서 만들 화면!
  },
  // {
  //   // 💡 3. 공지사항 작성 (시스템/기관 관리자용)
  //   path: "/notice/write",
  //   name: "NoticeWrite",
  //   component: () => import("../views/components/NoticeList.vue"), // 다다음 스텝에서 만들 화면!
  // },
  // {
  //   // 💡 4. 공지사항 수정 (시스템/기관 관리자용 - 작성 화면 껍데기 재활용!)
  //   path: "/notice/edit/:noticeId",
  //   name: "NoticeEdit",
  //   component: () => import("../views/components/NoticeList.vue"),
  // },
];
