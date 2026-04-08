// D:\node-vue-project\server\middlewares\downloadFile_notice.js
const path = require("path");
const fs = require("fs");

const uploadDir = "/home/ubuntu/uploads/result";

const downloadFileApprovalResult = (req, res, next) => {
  try {
    const fileName = decodeURIComponent(req.params.fileName || "");

    if (!fileName) {
      return res.status(400).json({
        status: "Failed",
        message: "파일명이 없습니다.",
      });
    }

    const safeFileName = path.basename(fileName);
    const filePath = path.join(uploadDir, safeFileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: "Failed",
        message: "파일이 존재하지 않습니다.",
      });
    }

    const downloadName = safeFileName.replace(/^\d+_/, "");

    return res.download(filePath, downloadName, (err) => {
      if (err) {
        console.log("user download error :", err);

        if (!res.headersSent) {
          return res.status(500).json({
            status: "Failed",
            message: "파일 다운로드 중 오류가 발생했습니다.",
          });
        }
      }
    });
  } catch (err) {
    console.log("downloadFileUser error :", err);
    return res.status(500).json({
      status: "Failed",
      message: "서버 오류",
    });
  }
};

module.exports = downloadFileApprovalResult;
