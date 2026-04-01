//상담기록 관력 router
const express = require("express");
const router = express.Router();
const consultService = require("../../services/consult_service");

//전체조회
router.get("/user", async (req, res) => {
  let result = await consultService.findAll();
  // console.log("전체조회", result);
  res.send(result);
});

//폼 장애유형 선택
router.get("/disability-types", async (req, res) => {
  let result = await consultService.description();
  console.log("장애유형", result);
  res.send(result);
});

module.exports = router;
