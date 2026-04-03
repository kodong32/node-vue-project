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

//문항 가져오는 라우터
router.get("/items/:Ver_Id", async (req, res) => {
  let { Ver_Id } = req.params;
  let result = await surveyService.items(Ver_Id);
  // console.log("문항 조회 결과:", result);
  res.json(result);
});

//건별조회
router.get("/surveySelect/:id", async (req, res) => {
  try {
    const userRole = req.session.role;
    const userId = req.session.userId;
    const surveyId = req.params.id;

    let result;

    //권한
    if (userRole === "a001") {
      // 시스템 관리자: 모든 설문 조회 가능
      result = await surveyService.surveyDetail(surveyId);
    } else if (userRole === "a002" || userRole === "a003") {
      // 기관 관리자 / 담당자: 소속 기관 설문 조회 가능
      result = await surveyService.surveyDetail(
        surveyId,
        null,
        req.session.institutionId,
      );
    } else if (userRole === "a004") {
      // 일반 사용자: 본인 설문만 조회 가능
      result = await surveyService.surveyDetail(surveyId, userId);
    } else {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    if (!result || result.length === 0) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    res.json(result);
  } catch (err) {
    console.error("건별조회 실패:", err);
    res.status(500).json;
  }
});

//타이틀 코드
router.get("/title", async (req, res) => {
  let result = await surveyService.title();
  // console.log("타이틀:", result);
  res.json(result);
});

//조사지 답변 조회
router.get("/answerSelect/:id", async (req, res) => {
  const id = req.params.id;
  let result = await surveyService.answerSelect(id);
  console.log("답변데이터:", result);
  res.json(result);
});

module.exports = router;
