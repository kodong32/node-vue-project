// src/routes/notice_router.js
const express = require("express");
const router = express.Router();
const noticeService = require("../../services/notice_service.js");

// 🌟 새로 만든 공지사항 전용 파일 업로드 미들웨어 불러오기
const uploadNotice = require("../../middlewares/uploadFile_notice.js");
const downloadFileNotice = require("../../middlewares/downloadFile_notice.js");

// 💡 1. 공지사항 목록 조회 (GET /notice/list)
router.get("/list", async (req, res) => {
  try {
    const result = await noticeService.fetchNoticeList(req.query);
    res.status(200).json(result);
  } catch (err) {
    console.error("공지사항 목록 조회 실패:", err);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

// 💡 2. 공지사항 상세 조회 (GET /notice/:id)
router.get("/:id", async (req, res) => {
  try {
    const result = await noticeService.fetchNoticeDetail(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "공지사항을 찾을 수 없습니다." });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("공지사항 상세 조회 실패:", err);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

// 💡 3. 공지사항 등록 (POST /notice/write)
// 🌟 미들웨어를 장착해서 최대 5개의 파일을 받을 수 있도록 설정!
router.post(
  "/write",
  uploadNotice.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
    { name: "file3", maxCount: 1 },
    { name: "file4", maxCount: 1 },
    { name: "file5", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = req.body;
      const files = req.files || {};

      // 🌟 [핵심 변경] 프론트에서 넘어온 가짜 명찰 무시하고, 백엔드 세션에서 직접 꺼내기!
      if (req.session.loginInstUser) {
        // 기관 이용자가 작성하는 경우 (시스템 관리자도 기관 테이블에 있다고 가정)
        body.writerType = req.session.loginInstUser.role; // 권한 코드 (예: a001, a002)
        body.writerId = req.session.loginInstUser.I_UserId; // 유저 ID (PK)
      } else {
        // 🚨 세션이 없으면 에러 처리 (보안)
        return res
          .status(401)
          .json({ message: "로그인이 필요하거나 권한이 없습니다." });
      }

      body.file1 = files.file1 ? files.file1[0].filename : "";
      body.file2 = files.file2 ? files.file2[0].filename : "";
      body.file3 = files.file3 ? files.file3[0].filename : "";
      body.file4 = files.file4 ? files.file4[0].filename : "";
      body.file5 = files.file5 ? files.file5[0].filename : "";

      const newNoticeId = await noticeService.addNotice(body);
      res.status(200).json({
        message: "공지사항이 성공적으로 등록되었습니다.",
        noticeId: newNoticeId,
      });
    } catch (err) {
      console.error("공지사항 등록 실패:", err);
      res
        .status(500)
        .json({ message: "공지사항 등록 중 오류가 발생했습니다." });
    }
  },
);

router.get("/download/:fileName", downloadFileNotice);

// 💡 4. 공지사항 수정 (PUT /notice/:id)
router.put(
  "/:id",
  uploadNotice.fields([
    { name: "file1", maxCount: 1 },
    // ...
  ]),
  async (req, res) => {
    try {
      const body = req.body;
      const files = req.files || {};

      // 🌟 [보안 검사] 수정 요청을 보낸 사람의 세션이 있는지 확인
      if (!req.session.loginInstUser) {
        return res
          .status(401)
          .json({ message: "로그인이 필요하거나 권한이 없습니다." });
      }

      // (파일 처리 로직 생략 - 이전과 동일)

      await noticeService.modifyNotice(req.params.id, body);
      res
        .status(200)
        .json({ message: "공지사항이 성공적으로 수정되었습니다." });
    } catch (err) {
      console.error("공지사항 수정 실패:", err);
      res
        .status(500)
        .json({ message: "공지사항 수정 중 오류가 발생했습니다." });
    }
  },
);

// 💡 5. 공지사항 삭제 (DELETE /notice/:id)
router.delete("/:id", async (req, res) => {
  try {
    // 🌟 [보안 검사] 삭제 요청을 보낸 사람의 세션이 있는지 확인
    if (!req.session.loginInstUser) {
      return res
        .status(401)
        .json({ message: "로그인이 필요하거나 권한이 없습니다." });
    }

    await noticeService.removeNotice(req.params.id);
    res.status(200).json({ message: "공지사항이 삭제되었습니다." });
  } catch (err) {
    console.error("공지사항 삭제 실패:", err);
    res.status(500).json({ message: "공지사항 삭제 중 오류가 발생했습니다." });
  }
});

module.exports = router;
