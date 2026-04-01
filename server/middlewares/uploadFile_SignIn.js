// userUpload.js (회원 전용)

const multer = require("multer");
const path = require("path");
const fs = require("fs");

//저장 경로 (환경별 분리 가능)
const uploadDir = "/home/ubuntu/uploads/user";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//storage 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // 한글 깨짐 방지
    const decodedName = Buffer.from(file.originalname, "latin1").toString("utf8");

    //확장자 유지
    const ext = path.extname(decodedName);
    const baseName = path.basename(decodedName, ext);

    //파일명 중복 방지
    cb(null, `${Date.now()}_${baseName}${ext}`);
  },
});

//multer 설정
const uploadUser = multer({
  storage,
  limits: {
    files: 2,
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = uploadUser;