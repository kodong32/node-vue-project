// D:\node-vue-project\server\routes\admin_instiuser_router.js
const express = require("express");
const router = express.Router();
const service = require("../../services/admin_instiuser_service.js");

// 💡 목록 조회 (토글 값 받기)
router.get("/list", async (req, res) => {
  try {
    const searchName = req.query.name || null;
    const isWaitOnly = req.query.isWaitOnly || "false";
    // 🌟 role 변수 삭제!

    // 🌟 파라미터에서 role 삭제
    const list = await service.getInstiUserList(searchName, isWaitOnly);
    res.status(200).json({ data: list });
  } catch (err) {
    res.status(500).json({ message: "조회 중 오류가 발생했습니다." });
  }
});

// 💡 선택 승인 (등록 버튼)
router.put("/approve", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0)
      return res.status(400).json({ message: "선택된 인원이 없습니다." });

    await service.approveInstiUsers(ids);
    res.status(200).json({ message: "승인 처리되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "승인 중 오류가 발생했습니다." });
  }
});

// 💡 선택 삭제 (삭제 버튼)
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;
    await service.deleteInstiUsers(ids);
    res.status(200).json({ message: "삭제되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "삭제 중 오류가 발생했습니다." });
  }
});

router.put("/edit", async (req, res) => {
  try {
    const { userId, name, tel } = req.body;
    if (!userId)
      return res.status(400).json({ message: "유저 ID가 없습니다." });

    await service.updateInstiUser(name, tel, userId);
    res.status(200).json({ message: "정보가 성공적으로 수정되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "수정 중 오류가 발생했습니다." });
  }
});

module.exports = router;
