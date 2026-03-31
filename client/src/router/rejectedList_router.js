// D:\node-vue-project\client\src\router\rejectedList_router.js
import RejectedPlanList from "../views/components/RejectedPlanList.vue";

const routes = [
  {
    path: "/manager/rejected/plan",
    name: "ManagerRejectedPlanList",
    component: RejectedPlanList,
  },
  {
    path: "/general/rejected/plan",
    name: "GeneralRejectedPlanList",
    component: RejectedPlanList,
  },
];

export default routes;
