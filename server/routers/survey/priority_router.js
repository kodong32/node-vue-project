// priority_router.js 우선순위 요청
const express = require("express");
const router = express.Router();
const priorityService = require("../../services/priority_service.js");

router.get("/:id", async (req, res) => {
  try {
    const info = await priorityService.fetchSupportInfo(req.params.id);
    res.json(info);
  } catch (err) {
    console.error(`지원자 정보 조회 라우터 에러: ${error}`);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

module.exports = router;
