//조사지 관련 router
const express = require("express");
const router = express.Router();
const surveyService = require("../../services/survey_service");

//조사지 전체조회 <김민지, mapper에 있는 함수 가져와서 라우터에 결과 전달>
router.get("/user", async (req, res) => {
  let result = await surveyService.findAll();
  res.send(result);
});

module.exports = router;
