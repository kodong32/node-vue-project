// src/routes/general_plan_router.js (새 파일 생성!)

const express = require("express");
const router = express.Router();
const generalPlanService = require("../../services/general_plan_service.js");

// 💡 [기관관리자 전용] 지원계획서 목록 조회 API
// 주소 예시: GET http://localhost:3000/general/plan/list?instiId=INST001&page=1
router.get("/list", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 💡 관리자 전용이라 role, userId는 뺐어! instiId가 핵심이야.
    const filters = {
      instiId: req.query.instiId, // 프론트에서 관리자 소속 기관 코드를 넘겨줘야 해
      managerName: req.query.managerName || "",
      guardianName: req.query.guardianName || "",
      supportName: req.query.supportName || "",
      surveyId: req.query.surveyId || "",
    };

    if (!filters.instiId) {
      return res
        .status(400)
        .json({ message: "기관 ID(instiId)가 필요합니다." });
    }

    const planList = await generalPlanService.fetchGeneralPlanList(
      filters,
      page,
      limit,
    );
    res.status(200).json(planList);
  } catch (err) {
    console.error(`[기관관리자] 지원계획서 라우터 에러: ${err}`);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

module.exports = router;
