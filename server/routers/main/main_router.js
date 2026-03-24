// main_router.js
// 메인페이지 관련 router
const express = require("express");
const router = express.Router();
const mainService = require("../../services/main_service.js");

// 일반이용자
router.get("/user/:id", async (req, res) => {
  let result = await mainService.findByUser(req.params.id);
  res.json(result);
});

// 기관담당자
router.get("/manager/:id", async (req, res) => {
  let result = await mainService.findByManager(req.params.id);
  res.json(result);
});
// 기관관리자
router.get("/general/:id", async (req, res) => {
  let result = await mainService.findByGeneral(req.params.id);
  res.json(result);
});

module.exports = router;
