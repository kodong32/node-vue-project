// src/routes/general_plan_router.js

const express = require("express");
const router = express.Router();
const generalPlanService = require("../../services/general_plan_service.js");

// 💡 [기관관리자 전용] 지원계획서 목록 조회 API
router.get("/list", async (req, res) => {
  try {
    // 🌟 1. [보안 방어막] 로그인 안 한 사람이 주소창으로 직접 치고 들어오면 쫓아냄!
    if (!req.session.loginInstUser) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 🌟 2. [핵심 변경] 프론트에서 주는 query 말고, 내 세션(신분증)에서 직접 기관 ID 꺼내기!
    const myInstiId = req.session.loginInstUser.institution_id;

    const filters = {
      instiId: myInstiId, // 👈 안전하게 꺼낸 내 기관 ID를 필터에 쏙!
      managerName: req.query.managerName || "",
      guardianName: req.query.guardianName || "",
      supportName: req.query.supportName || "",
      surveyId: req.query.surveyId || "",
    };

    // (기존에 있던 if (!filters.instiId) 에러 체크는 세션에서 무조건 꺼내오므로 지워도 무방합니다!)

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
