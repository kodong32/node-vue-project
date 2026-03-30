// src/routes/user_plan_router.js

const express = require("express");
const router = express.Router();
// 💡 service 파일도 user_plan_service.js 로 하나 만들어주면 완벽해!
const userPlanService = require("../../services/user_plan_service.js");

// GET http://localhost:3000/user/plan/list
router.get("/list", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      userId: "GUSR0009", // 🚨 하드코딩 (나중에 세션 req.session.user.id 로 변경)
      surveyId: req.query.surveyId || "",
    };

    const planList = await userPlanService.fetchUserPlanList(
      filters,
      page,
      limit,
    );
    res.status(200).json(planList);
  } catch (err) {
    console.error(`[일반이용자] 지원계획서 라우터 에러: ${err}`);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

module.exports = router;
