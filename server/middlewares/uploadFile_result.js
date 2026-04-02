const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 💡 1. 지원결과서 전용 저장 경로 세팅!
const uploadDir = "/home/ubuntu/uploads/result";

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

const uploadResult = multer({
  storage,
  limits: {
    files: 2, // 💡 2. 결과서는 최대 2개!
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  },
});

module.exports = uploadResult;
