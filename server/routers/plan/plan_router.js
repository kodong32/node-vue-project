//기관 담당자 지원계획서 관련 router
const express = require("express");
const fs = require("fs");
const router = express.Router();
const uploadSupportPlan = require("../../middlewares/uploadFile_supPlan.js");
const { requireInstUser, requireInstRole } = require("../../middlewares/instiUserMiddleware.js");
const managerService = require("../../services/plan_service.js");

//지원 계획서 등록
router.post(`/insertplan`, uploadSupportPlan.fields([
  { name: "file1", maxCount: 1 },
  { name: "file2", maxCount: 1 },
]),
  requireInstUser,
  requireInstRole,
  async (req, res) => {
    try {
      const body = req.body;
      const files = req.files || {};

      const file1 = files.file1 ? files.file1[0] : null;
      const file2 = files.file2 ? files.file2[0] : null;
      const totalSize = (file1 ? file1.size : 0) + (file2 ? file2.size : 0);

      if (totalSize > 50 * 1024 * 1024) { //50MB
        if (file1 && fs.existsSync(file1.path)) {
          fs.unlinkSync(file1.path);
        }

        if (file2 && fs.existsSync(file2.path)) {
          fs.unlinkSync(file2.path);
        }

        return res.send({
          status: "Failed",
          message: "첨부파일 총 용량은 50MB를 초과할 수 없습니다."
        });
      }
      const data = {
        J_ID: body.J_ID,
        I_UserId: body.I_UserId,
        startDate: body.startDate,
        endDate: body.endDate,
        purpose: body.purpose,
        content: body.content,
        file: file1 ? file1.filename : null,
        file2: file2 ? file2.filename : null,
      };

      const result = await managerService.insertPlan(data);

      return res.send(result);
    } catch (err) {

    }
  }
)

//조사지 불러오기
router.get(`/getSurvey`, requireInstUser, requireInstRole, async (req, res) => {
  try {
    const loginInstUser = req.session.loginInstUser;
    const I_UserId = loginInstUser.I_UserId;

    const result = await managerService.getSurveyListByInstUser(I_UserId);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

//지원계획서 list
router.get(`/list`, requireInstUser, requireInstRole, async (req, res) => {
  const loginInstUser = req.session.loginInstUser;
  const I_UserId = loginInstUser.I_UserId;
  
  const managerName = req.query.managerName?.trim() || null;
  const guardianName = req.query.guardianName?.trim() || null;
  const supportName = req.query.supportName?.trim() || null;

  const result = await managerService.getSupportListByInstUser(I_UserId, managerName, guardianName, supportName);
  res.send(result);
});

//지원계획서 삭제
router.delete("/plan/delete/:id", async(req,res) => {
  const supportPlan_Id = req.params.id;
  const result = await managerService.deletePlan(supportPlan_Id);

  res.send(result);
});

module.exports = router;
