//상담기록 관력 router
const express = require("express");
const router = express.Router();
const consultService = require("../../services/consult_service");

//전체조회
router.get("/user", async (req, res) => {
  try {
    //로그인
    if (!req.session.loginInstUser || !req.session.loginInstUser.I_UserId) {
      return res.status(401).send({
        success: false,
        message: "로그인 필요",
      });
    }

    console.log("세션 유저:", req.session.loginInstUser);

    const user = req.session.loginInstUser;

    //권한 체크
    if (user.role && !["a002", "a003"].includes(user.role)) {
      return res.status(403).send({
        success: false,
        message: "권한 없음",
      });
    }

    let result = await consultService.findAll(user.I_UserId);

    return res.send({
      success: true,
      data: result.data || [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "서버 오류",
    });
  }
});

//건별조회
router.get("/user/:no", async (req, res) => {
  try {
    const result = await consultService.consultDetail(req.params.no);
    res.json(result);
  } catch (err) {
    console.error("건별조회 실패:", err);
    res.status(500).json();
  }
});

//폼 장애유형 대 선택
router.get("/disability-types", async (req, res) => {
  let result = await consultService.description();
  // console.log("장애유형", result);
  res.send(result);
});

//폼 장애유형 중 선택
router.get("/consultMiddle", async (req, res) => {
  let result = await consultService.descriptionMiddle();
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
