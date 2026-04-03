// D:\node-vue-project\client\src\router\result_plan_router.js
// 지원결과서 작성
export default [
  // 담당자 - 지원결과서 작성
  {
    path: "/manager/result/write",
    name: "ManagerResultPlanWrite",
    component: () => import("../views/components/ResultPlanWrite.vue"),
  },
  // 담당자 - 본인 지원결과서 조회
  {
    path: "/manager/result/list",
    name: "ManagerResultList",
    component: () => import("../views/components/GeneralResultList.vue"),
  },
  // 관리자 - 기관 전체 지원결과서 조회
  {
    path: "/general/result/list",
    name: "GeneralResultList",
    component: () => import("../views/components/GeneralResultList.vue"),
  },
  // 담당자 - 반려된 본인 지원결과서 조회
  {
    path: "/manager/result/rejected",
    name: "ManagerResultRejected",
    component: () => import("../views/components/RejectedResultList.vue"),
  },
  // 관리자 - 기관 전체 반려된 지원결과서 조회
  {
    path: "/general/result/rejected",
    name: "GeneralResultRejected",
    component: () => import("../views/components/RejectedResultList.vue"),
  },
  // 일반이용자 - 지원결과서 조회
  {
    path: "/user/result",
    name: "UserResultList",
    component: () => import("../views/components/GeneralResultList.vue"),
  },
];
