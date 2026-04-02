//조사지 관련 router
const express = require("express");
const router = express.Router();
const surveyService = require("../../services/survey_service");

//사이드바-남/여 공통코드
router.get("/gender", async (req, res) => {
  let result = await surveyService.gender();
  // console.log("남여", result);
  res.send(result);
});

//지원대상자 리스트
router.get("/support", async (req, res) => {
  let result = await surveyService.support();
  // console.log("지원대상자", result);
  res.send(result);
});

//폼 장애유형 대 선택
router.get("/disability-types", async (req, res) => {
  let result = await surveyService.description();
  // console.log("장애유형", result);
  res.send(result);
});

//폼 장애유형 중 선택
router.get("/consultMiddle", async (req, res) => {
  let result = await surveyService.descriptionMiddle();
  // console.log("장애유형", result);
  res.send(result);
});

//조사지 등록
router.post("/add", async (req, res) => {
  try {
    let target = req.body;

    let result = await surveyService.serveyAdd(target);

    if (result && (result.affectedRows > 0 || result.insertId)) {
      res.send({ status: "success", data: result });
    } else {
      res.send({ status: "fail" });
    }
  } catch (err) {
    console.error(err);
  }
});

//조사지 등록 pk마지막 row 증가
router.get("/newId", async (req, res) => {
  try {
    const newId = await surveyService.surveyJId();
    res.send(newId);
  } catch (err) {
    console.error(err);
  }
});

//등록시 답변 데이터
router.post("/answer", async (req, res) => {
  try {
    const { J_ID, answerList } = req.body;

    // 1. 마지막 ID 조회 (기존 로직)
    const lastRow = await surveyService.lastAnswer();
    const nextId = lastRow.length > 0 ? lastRow[0].answer_id + 1 : 1;

    const QuestionId = "ITEM0054";

    const info = [nextId, J_ID, QuestionId, answerList.join(",")];

    const result = await surveyService.answerAdd(info);
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).send("저장 실패");
  }
});

//조사지 답변 마지막 row를 기준으로 pk 생성
router.get("/last", async (req, res) => {
  try {
    const result = await surveyService.lastAnswer();
    res.send(result);
  } catch (err) {
    console.error(err);
  }
});

// //문항 가져오는 라우터
router.get("/items/:Ver_Id", async (req, res) => {
  let { Ver_Id } = req.params;
  let result = await surveyService.items(Ver_Id);
  // console.log("문항 조회 결과:", result);
  res.json(result);
});

// //조사지 전체조회 <김민지, 브라우저에 응답 결과 전달 26.03.23 추가>
// router.get("/user", async (req, res) => {
//   let result = await surveyService.findAll();
//   res.send(result);
// });

// //조사지 건별조회 <김민지, 브라우저에 응답 결과 전달 26.03.23 추가>
// router.get("/user/:no", async (req, res) => {
//   console.log(req.params.no);
//   let target = req.params.no;
//   console.log("건별조회", target);
//   let result = await surveyService.findInfoByNo(target);
//   console.log("건별조회", result);
//   res.send(result);
// });

// //조사지 문항에 대한 답변 <김민지, 26.03.24 추가>
// router.get("/selectItemsByJID/:id", async (req, res) => {
//   let { id } = req.params;
//   let result = await surveyService.selectItemsByJID(id);
//   res.send(result);
// });
module.exports = router;
