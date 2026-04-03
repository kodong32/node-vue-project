// src/routes/priority_router.js
const express = require("express");
const router = express.Router();
const priorityService = require("../../services/priority_service.js");

// 🌟 [미들웨어] 기관 사용자 로그인 방어막 함수
const requireInstLogin = (req, res, next) => {
  if (!req.session.loginInstUser) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  next();
};

// 💡 1. 지원자 정보 조회 (로그인한 기관 사용자만)
router.get("/:id", requireInstLogin, async (req, res) => {
  try {
    const info = await priorityService.fetchSupportInfo(req.params.id);
    res.json(info);
  } catch (err) {
    console.error(`지원자 정보 조회 라우터 에러: ${err}`);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

// 💡 2. 우선순위 승인 '요청' (담당자가 요청)
router.post("/:id", requireInstLogin, async (req, res) => {
  try {
    // (선택 사항) 담당자(a003)만 요청하게 하려면 여기서 role 체크!
    const surveyId = req.params.id;
    const requestData = req.body;

    const result = await priorityService.processPriorityRequest(
      surveyId,
      requestData,
    );

    if (result)
      res.status(200).json({ message: "우선순위 승인 요청이 완료되었습니다!" });
    else res.status(500).json({ message: "DB 저장 중 오류가 발생했습니다." });
  } catch (err) {
    console.error(`승인 요청 라우터 에러: ${err}`);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

// 💡 3. 화면에 띄울 요청 정보 가져오기
router.get("/request-info/:id", requireInstLogin, async (req, res) => {
  try {
    const info = await priorityService.fetchApprovalWaitInfo(req.params.id);
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: "서버 에러" });
  }
});

// 💡 4. [중요!] 우선순위 '승인/반려' 결정 (오직 기관 관리자만 가능!)
router.post("/decide/:id", requireInstLogin, async (req, res) => {
  try {
    // 🌟 [권한 방어막] 세션 롤이 기관 관리자(a002)가 아니면 쫓아냄!
    const role =
      req.session.loginInstUser.role || req.session.loginInstUser.roll;
    if (role !== "a002") {
      return res
        .status(403)
        .json({ message: "결재 권한이 없습니다. (기관 관리자 전용)" });
    }

    const result = await priorityService.processDecidePriority(
      req.params.id,
      req.body,
    );

    if (result) res.status(200).json({ message: "처리가 완료되었습니다." });
    else res.status(500).json({ message: "DB 처리 중 오류가 발생했습니다." });
  } catch (err) {
    res.status(500).json({ message: "서버 에러" });
  }
});

module.exports = router;
