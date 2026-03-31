// src/routes/rejected_plan_router.js
const express = require("express");
const router = express.Router();
const service = require("../../services/rejected_plan_service.js");

// GET /rejected/plan/list
router.get("/list", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 프론트에서 던져주는 역할(GENERAL or MANAGER) 받기
    const role = req.query.role || "MANAGER";

    // 🚨 [임시 하드코딩] 나중에 세션 연결되면 실제 로그인 ID로 교체!
    // MANAGER일 때는 IUSR0003(박담당), GENERAL일 때는 INST0000(기관ID)
    const loginId = role === "MANAGER" ? "IUSR0003" : "INST0000";

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
