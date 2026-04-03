// src/routes/rejected_plan_router.js
const express = require("express");
const router = express.Router();
const service = require("../../services/rejected_plan_service.js");

// GET /rejected/plan/list
router.get("/list", async (req, res) => {
  try {
    // 🌟 1. [보안 방어막] 세션 없으면 쫓아내기
    if (!req.session.loginInstUser) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 🌟 2. [핵심 변경] 프론트에서 주는 role 무시하고, 세션에서 진짜 권한 꺼내기!
    const sessionRole = req.session.loginInstUser.role; // 'a002' 또는 'a003'

    let role = "";
    let loginId = "";

    // 🌟 3. 권한에 따라 가져올 데이터 기준(loginId)을 서버가 직접 세팅!
    if (sessionRole === "a002") {
      role = "GENERAL"; // 기관 관리자
      loginId = req.session.loginInstUser.institution_id; // 소속 기관 전체 데이터를 봐야 하니 '기관 ID' 세팅
    } else if (sessionRole === "a003") {
      role = "MANAGER"; // 기관 담당자
      loginId = req.session.loginInstUser.I_UserId; // 내 담당 데이터만 봐야 하니 '본인 유저 ID' 세팅
    } else {
      return res
        .status(403)
        .json({ message: "반려 내역을 볼 권한이 없습니다." });
    }

    const filters = {
      managerName: req.query.managerName || "",
      guardianName: req.query.guardianName || "",
      supportName: req.query.supportName || "",
    };

    const result = await service.fetchRejectedList(
      role,
      loginId,
      filters,
      page,
      limit,
    );
    res.status(200).json(result);
  } catch (err) {
    console.error(`[반려내역] 라우터 에러: ${err}`);
    res
      .status(500)
      .json({ message: "반려 내역을 불러오는 중 서버 에러가 발생했습니다." });
  }
});

module.exports = router;
