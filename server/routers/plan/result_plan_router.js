// src/routes/result_plan_router.js
const express = require("express");
const router = express.Router();
const service = require("../../services/result_plan_service.js");
const uploadResult = require("../../middlewares/uploadFile_result.js");

// 1. 모달에 띄울 '승인된 계획서' 목록 가져오기
router.get("/approved-list", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // 🚨 [임시 하드코딩] 로그인한 담당자 ID (박담당)
    const managerId = "IUSR0003";

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

// 2. 지원결과서 저장 (승인 요청)
router.post(
  "/write",
  uploadResult.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // 🌟 파일 정보는 req.files에, 나머지 텍스트 데이터는 req.body에 들어있음
      const { supportPlan_id, result, content } = req.body;
      const files = req.files || {};

      // 🚨 [임시 하드코딩] 작성자 ID (세션 연동 전까지 유지)
      const managerId = "IUSR0003";

      if (!supportPlan_id || !result || !content) {
        return res
          .status(400)
          .json({ message: "필수 항목을 모두 입력해주세요." });
      }

      // 🌟 업로드된 파일이 있으면 파일명을 객체에 넣고, 없으면 빈칸("")
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

// 지원결과서 조회
router.get("/general-list", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role; // 'manager' 혹은 'general'

    const instiId = "INST0000";
    // 🌟 만약 담당자(manager)라면 본인 ID 세팅, 관리자라면 null로 넘겨서 전체 조회
    const managerId = role === "manager" ? "IUSR0003" : null;

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

// 지원결과서 반려 목록 조회
router.get("/rejected-list", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;

    const instiId = "INST0000";
    const managerId = role === "manager" ? "IUSR0003" : null;

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
