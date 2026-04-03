// src/routes/user_result_router.js

const express = require("express");
const router = express.Router();

// 💡 서비스 파일 경로 확인 필수!
const userResultService = require("../../services/user_result_service.js");

// GET /user/result/list
router.get("/list", async (req, res) => {
  try {
    // 🌟 1. [보안 방어막] 일반 이용자 세션 확인
    if (!req.session.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // 🌟 2. 필터 객체 조립 (매퍼로 그대로 전달될 바구니)
    const filters = {
      userId: req.session.user.G_UserId, // 세션에서 꺼낸 1중 자물쇠
      surveyId: req.query.surveyId || "", // 주소창에서 달고 온 조사지 ID (예: SUV0025)
    };

    // 🌟 3. 서비스 호출
    const resultList = await userResultService.fetchUserResultList(filters);

    // 🌟 4. 프론트엔드로 데이터 발송
    res.status(200).json(resultList);
  } catch (err) {
    console.error(`[일반이용자] 지원결과서 라우터 에러: ${err}`);
    res.status(500).json({ message: "서버 에러 발생" });
  }
});

module.exports = router;
