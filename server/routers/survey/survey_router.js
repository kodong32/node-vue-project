//조사지 관련 router
const express = require("express");
const router = express.Router();
const surveyService = require("../../services/survey_service");
const {
  requireInstUser,
  requireInstRole,
} = require("../../middlewares/instiUserMiddleware.js");

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

//getFormvesion
router.get("/getversion", async (req, res) => {
  let result = await surveyService.getVersion();

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
// router.post("/answer", async (req, res) => {
//   try {
//     const { J_ID, answerList } = req.body;

//     const lastRow = await surveyService.lastAnswer();
//     const nextId = lastRow.length > 0 ? lastRow[0].answer_id + 1 : 1;

//     const QuestionId = "ITEM0054";

//     const info = [nextId, J_ID, QuestionId, answerList.join(",")];

//     const result = await surveyService.answerAdd(info);
//     res.json({ success: true, result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("저장 실패");
//   }
// });
router.post("/answer", async (req, res) => {
  try {
    const { J_ID, answerList } = req.body;

    const lastRow = await surveyService.lastAnswer();

    let nextNum = 0;

    if (lastRow.length > 0) {
      const lastId = lastRow[0].answer_id; // ANS0009
      nextNum = parseInt(lastId.substring(3), 10);
    }

    const results = [];

    for (const item of answerList) {
      nextNum += 1;

      const answer_id = "ANS" + String(nextNum).padStart(4, "0");

      const info = [
        answer_id,
        J_ID,
        item.question_id,
        item.answer,
      ];

      console.log("insert:", info);

      const result = await surveyService.answerAdd(info);
      results.push(result);
    }

    res.json({ success: true, result: results });

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
    const surveyId = req.params.id;
    let userRole, userId, institutionId;

    // 1. 세션 확인 및 정보 추출
    if (req.session.user) {
      userRole = req.session.user.role;
      userId = req.session.user.G_UserId;
      institutionId = req.session.user.institution_id;
    } else if (req.session.loginInstUser) {
      userRole = req.session.loginInstUser.role;
      userId = req.session.loginInstUser.I_UserId;
      institutionId = req.session.loginInstUser.institution_id;
    } else {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    console.log("세션 user:", req.session.user);
    console.log("세션 loginInstUser:", req.session.loginInstUser);

    // 2. 서비스 호출 (권한 정보를 객체로 묶어서 전달하면 관리가 편합니다)
    const result = await surveyService.surveyDetail({
      surveyId,
      userRole,
      userId,
      institutionId,
    });

    if (!result || result.length === 0) {
      return res
        .status(403)
        .json({ message: "조회 권한이 없거나 존재하지 않는 데이터입니다." });
    }

    res.json(result);
  } catch (err) {
    console.error("건별조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
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
