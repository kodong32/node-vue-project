// 메인페이지 관련 router
const express = require("express");
const router = express.Router();

const mainService = require("../../services/main_service.js");

router.get(`/:userId`, async (req, res) => {
  const userId = req.params.userId;
  try {
    let result = await mainService.findById(userId);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버오류" });
  }
});

module.exports = router;
