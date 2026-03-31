// src/routes/approval_result_router.js
const express = require("express");
const router = express.Router();
const service = require("../../services/approval_result_service.js");

// 1. 대기 목록 조회 API
router.get("/list", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const instiId = "INST0000"; // 🚨 임시 하드코딩

    const filters = {
      managerName: req.query.managerName || "",
      guardianName: req.query.guardianName || "",
      supportName: req.query.supportName || "",
    };

    const result = await service.fetchPendingResultList(
      instiId,
      filters,
      page,
      limit,
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "조회 실패", error: err.message });
  }
});

// 2. 승인 API
router.put("/approve/:resultId", async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const adminId = "IUSR0000"; // 🚨 승인 관리자 임시 하드코딩

    await service.handleApprove(resultId, adminId);
    res.status(200).json({ message: "지원결과서 승인 완료" });
  } catch (err) {
    res.status(500).json({ message: "승인 처리 실패", error: err.message });
  }
});

// 3. 반려 API
router.put("/reject/:resultId", async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const { rejectReason } = req.body;
    const adminId = "IUSR0000"; // 🚨 반려 관리자 임시 하드코딩

    await service.handleReject(resultId, adminId, rejectReason);
    res.status(200).json({ message: "지원결과서 반려 완료" });
  } catch (err) {
    res.status(500).json({ message: "반려 처리 실패", error: err.message });
  }
});

module.exports = router;
