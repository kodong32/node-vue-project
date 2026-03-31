// src/routes/result_plan_router.js
const express = require("express");
const router = express.Router();
const service = require("../../services/result_plan_service.js");

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
router.post("/write", async (req, res) => {
  try {
    const { supportPlan_id, result, content, file1, file2 } = req.body;
    // 🚨 [임시 하드코딩] 작성자 ID
    const managerId = "IUSR0003";

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
      file1,
      file2,
    };
    const response = await service.savePlanResult(saveData);

    res
      .status(200)
      .json({
        message: "지원결과서가 성공적으로 등록되었습니다.",
        data: response,
      });
  } catch (err) {
    res.status(500).json({ message: "결과서 등록 실패", error: err.message });
  }
});

module.exports = router;
