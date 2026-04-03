// src/routes/result_plan_router.js
const express = require("express");
const router = express.Router();
const service = require("../../services/result_plan_service.js");
const uploadResult = require("../../middlewares/uploadFile_result.js");

// 💡 1. 모달에 띄울 '승인된 계획서' 목록 가져오기 (기관 담당자 전용)
router.get("/approved-list", async (req, res) => {
  try {
    // 🌟 [보안 검사]
    if (!req.session.loginInstUser) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 🌟 [핵심 변경] 하드코딩 제거! 세션에서 로그인한 담당자 ID 꺼내기
    const managerId = req.session.loginInstUser.I_UserId;

    const filters = {
      managerName: req.query.managerName || "",
      guardianName: req.query.guardianName || "",
      supportName: req.query.supportName || "",
    };

    const result = await service.fetchApprovedPlansForModal(
      managerId,
      filters,
      page,
      limit,
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "조회 실패", error: err.message });
  }
});

// 💡 2. 지원결과서 저장 (승인 요청)
router.post(
  "/write",
  uploadResult.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // 🌟 [보안 검사]
      if (!req.session.loginInstUser) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
      }

      const { supportPlan_id, result, content } = req.body;
      const files = req.files || {};

      // 🌟 [핵심 변경] 하드코딩 제거! 작성자(담당자) ID 세션에서 꺼내기
      const managerId = req.session.loginInstUser.I_UserId;

      if (!supportPlan_id || !result || !content) {
        return res
          .status(400)
          .json({ message: "필수 항목을 모두 입력해주세요." });
      }

      const saveData = {
        supportPlan_id,
        managerId,
        result,
        content,
        file1: files.file1 ? files.file1[0].filename : "",
        file2: files.file2 ? files.file2[0].filename : "",
      };

      const response = await service.savePlanResult(saveData);

      res.status(200).json({
        message: "지원결과서가 성공적으로 등록되었습니다.",
        data: response,
      });
    } catch (err) {
      console.error("결과서 등록 실패:", err);
      res.status(500).json({ message: "결과서 등록 실패", error: err.message });
    }
  },
);

// 💡 3. 지원결과서 일반 목록 조회
router.get("/general-list", async (req, res) => {
  try {
    // 🌟 [보안 검사]
    if (!req.session.loginInstUser) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 🌟 [핵심 변경] 프론트엔드가 주는 role 무시하고 세션에서 진짜 권한(role)과 기관ID 꺼내기
    const sessionRole = req.session.loginInstUser.role;
    const instiId = req.session.loginInstUser.institution_id;
    let managerId = null;

    if (sessionRole === "a003") {
      // 기관 담당자면 자기 담당 리스트만
      managerId = req.session.loginInstUser.I_UserId;
    } else if (sessionRole === "a002") {
      // 기관 관리자면 기관 전체 리스트 (managerId = null 유지)
    } else {
      return res.status(403).json({ message: "조회 권한이 없습니다." });
    }

    const filters = {
      managerName: req.query.managerName || "",
      guardianName: req.query.guardianName || "",
      supportName: req.query.supportName || "",
      surveyId: req.query.surveyId || "",
    };

    const result = await service.fetchGeneralResultList(
      instiId,
      managerId,
      filters,
      page,
      limit,
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "조회 실패", error: err.message });
  }
});

// 💡 4. 지원결과서 반려 목록 조회
router.get("/rejected-list", async (req, res) => {
  try {
    // 🌟 [보안 검사]
    if (!req.session.loginInstUser) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 🌟 [핵심 변경] 위 general-list와 완벽하게 동일한 권한/기관 분기 처리!
    const sessionRole = req.session.loginInstUser.role;
    const instiId = req.session.loginInstUser.institution_id;
    let managerId = null;

    if (sessionRole === "a003") {
      managerId = req.session.loginInstUser.I_UserId;
    } else if (sessionRole === "a002") {
      // managerId = null 유지
    } else {
      return res.status(403).json({ message: "조회 권한이 없습니다." });
    }

    const filters = {
      managerName: req.query.managerName || "",
      guardianName: req.query.guardianName || "",
      supportName: req.query.supportName || "",
      surveyId: req.query.surveyId || "",
    };

    const result = await service.fetchRejectedResultList(
      instiId,
      managerId,
      filters,
      page,
      limit,
    );
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "반려 목록 조회 실패", error: err.message });
  }
});

module.exports = router;
