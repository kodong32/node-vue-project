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
  console.log(req.params.no);
  let target = req.params.no;
  console.log("건별조회", target);
  let result = await surveyService.findInfoByNo(target);
  console.log("건별조회", result);
  res.send(result);
});

// //조사지 등록과 답변 <김민지, 브라우저에 응답 결과 전달 26.03.24 추가>
router.post("/user", async (req, res) => {
  let data = req.body;
  let result = await surveyService.surveyInfo(data);
  // res.send({ success: true, result });
  res.send(result);
});

//조사지 문항에 대한 답변 <김민지, 26.03.24 추가>
router.get("/selectItemsByJID/:id", async (req, res) => {
  let { id } = req.params;
  let result = await surveyService.selectItemsByJID(id);
  res.send(result);
});

//일반이용자가 추가한 지원대상자 정보 <김민지, 260326>
router.get("/support/:id", async (req, res) => {
  let target = req.params.id;
  let result = await surveyService.SupportById(target);
  res.send(result);
});

// router.post("user", async (req, res) => {
//   console.log("들어온 데이터:", req.body);
//   let data = req.body;
//   let result = await surveyService.momUser(data);
//   res.send(result);
// });

//문항 가져오는 라우터
router.get("/getQuestionsByJID/:id", async (req, res) => {
  let { id } = req.params;
  let result = await surveyService.getQuestionsByJID(id);
  // console.log("문항 조회 결과:", result);
  res.json(result || []);
});

//활성화된 폼 아이디 가져오는 라우터
router.get("/getActiveVerId", async (req, res) => {
  try {
    const Ver_Id = await surveyService.getActiveVerId();
    res.json({ Ver_Id: Ver_Id || "FORM0004" });
  } catch (err) {
    res.json({ Ver_Id: "FORM0004" });
  }
});
module.exports = router;
