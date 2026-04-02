const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 💡 1. 공지사항 전용 저장 경로 세팅
const uploadDir = "/home/ubuntu/uploads/notice";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const decodedName = Buffer.from(file.originalname, "latin1").toString(
      "utf8",
    );
    cb(null, `${Date.now()}_${decodedName}`);
  },
});

const uploadNotice = multer({
  storage,
  limits: {
    files: 5, // 공지사항은 최대 5개!
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  },
});

module.exports = uploadNotice;
