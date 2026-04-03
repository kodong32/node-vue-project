// src/routes/user_plan_router.js

const express = require("express");
const router = express.Router();
// 💡 service 파일도 user_plan_service.js 로 하나 만들어주면 완벽해!
const userPlanService = require("../../services/user_plan_service.js");

// GET http://localhost:3000/user/plan/list
router.get("/list", async (req, res) => {
  try {
    // 🌟 1. [보안 방어막] 일반 이용자 세션이 없으면 쫓아내기!
    // (💡 팀장님이 설정한 일반 유저 세션 변수명이 맞는지 확인해 주세요. 보통 loginUser를 씁니다.)
    if (!req.session.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 🌟 2. [핵심 변경] 하드코딩 제거! 세션에서 진짜 내 아이디 꺼내오기
    // (💡 로그인 시 저장한 변수명에 따라 G_UserId 또는 userId 일 수 있습니다.)
    const myUserId = req.session.user.G_UserId;

    const filters = {
      userId: myUserId, // 👈 "GUSR0009" 대신 안전하게 꺼낸 내 유저 ID를 필터에 쏙!
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
