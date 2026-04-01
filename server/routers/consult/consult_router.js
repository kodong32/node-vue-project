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
  // console.log("장애유형", result);
  res.send(result);
});

//폼 상담장소 선택
router.get("/place", async (req, res) => {
  let result = await consultService.placeList();
  // console.log("상담장소", result);
  res.send(result);
});

//폼 상담방법 선택
router.get("/method", async (req, res) => {
  let result = await consultService.methodList();
  // console.log("상담방법", result);
  res.send(result);
});

//폼 담당자 정/부
router.get("/manager", async (req, res) => {
  let result = await consultService.manager();
  // console.log("담당자", result);
  res.send(result);
});

//상담기록 등록
router.post("/consultAdd", async (req, res) => {
  let target = req.body;
  const newCID = await consultService.counsultId();
  target.counsult_id = newCID;
  target.J_ID = target.J_ID || "admin";
  let result = await consultService.consultAdd(target);
  console.log("상담기록", result);
  res.send({ status: "success", counsult_no: newCID, result });
});

module.exports = router;
