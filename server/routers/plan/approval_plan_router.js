// src/routes/approval_plan_router.js
const express = require("express");
const router = express.Router();
const service = require("../../services/approval_plan_service.js");

// 💡 1. 대기 목록 조회 API
router.get("/list", async (req, res) => {
  try {
    // 🌟 [보안 및 세션 검사] 로그인이 안 되어있으면 접근 차단
    if (!req.session.loginInstUser) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 🌟 [핵심 변경] 하드코딩(INST0000) 제거! 세션에서 로그인한 사람의 '기관 ID' 꺼내기
    const instiId = req.session.loginInstUser.institution_id;

    const filters = {
      managerName: req.query.managerName || "",
      guardianName: req.query.guardianName || "",
      supportName: req.query.supportName || "",
    };

    const result = await service.fetchPendingList(
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

// 💡 2. 승인 API (PUT 요청)
router.put("/approve/:planId", async (req, res) => {
  try {
    // 🌟 [보안 및 세션 검사]
    if (!req.session.loginInstUser) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const planId = req.params.planId;

    // 🌟 [핵심 변경] 하드코딩(IUSR0001) 제거! 세션에서 결재자(관리자)의 진짜 '유저 ID' 꺼내기
    const adminId = req.session.loginInstUser.I_UserId;

    await service.handleApprove(planId, adminId);
    res.status(200).json({ message: "승인 완료" });
  } catch (err) {
    res.status(500).json({ message: "승인 처리 실패", error: err.message });
  }
});

// 💡 3. 반려 API (PUT 요청 - body에 반려 사유 포함)
router.put("/reject/:planId", async (req, res) => {
  try {
    // 🌟 [보안 및 세션 검사]
    if (!req.session.loginInstUser) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const planId = req.params.planId;
    const { rejectReason } = req.body;

    // 🌟 [핵심 변경] 하드코딩 제거! 반려 처리하는 결재자 '유저 ID' 꺼내기
    const adminId = req.session.loginInstUser.I_UserId;

    await service.handleReject(planId, adminId, rejectReason);
    res.status(200).json({ message: "반려 완료" });
  } catch (err) {
    res.status(500).json({ message: "반려 처리 실패", error: err.message });
  }
});

module.exports = router;
