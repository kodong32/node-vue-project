//조사지 관련 router
const express = require("express");
const router = express.Router();
const surveyService = require("../../services/survey_service");

//조사지 전체조회 <김민지, 브라우저에 응답 결과 전달 26.03.23 추가>
router.get("/user", async (req, res) => {
  let result = await surveyService.findAll();
  res.send(result);
});

//조사지 건별조회 <김민지, 브라우저에 응답 결과 전달 26.03.23 추가>
router.get("/user/:no", async (req, res) => {
  let target = req.params.no;
  let result = await surveyService.fineInfoByNo(target);
  res.send(result);
});

//조사지 등록 <김민지, 브라우저에 응답 결과 전달 26.03.23 추가>
router.post(`/user/survey`, async (req, res) => {
  let target = req.body;
  let result = await surveyService.createSurvey(target);
  res.send(result);
});

//조사지 답변 <김민지, 브라우저에 응답 결과 전달 26.03.24 추가>
router.post("/user/answer", async (req, res) => {
  let data = req.body;
  let result = await surveyService.createAnswer(data);
  res.json({ success: true, result });
  // res.send(result);
});

//조사지 문항에 대한 답변 <김민지, 26.03.24 추가>
router.get("/getQuestionsByJID/:id", async (req, res) => {
  let { id } = req.params;
  let result = await surveyService.getQuestionsByJID(id);
  res.json(result);
});

module.exports = router;
