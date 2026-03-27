//supportPlan 파일 첨부 시 검증하는 middleware입니다.

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "/home/ubuntu/uploads/supportPlan";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueName = `${Date.now()}_${baseName}${ext}`;
    cb(null, uniqueName);
  },
});

const uploadSupportPlan = multer({
  storage,
  limits: {
    files: 2,
  },
});

module.exports = uploadSupportPlan;