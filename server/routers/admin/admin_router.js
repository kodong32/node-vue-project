//sysAdmin 라우터

const express = require("express");
const router = express.Router();

const adminService = require("../../services/admin_service.js");
const { requireAdmin } = require("../../middlewares/adminMiddleware.js");

router.post(`/login`, async (req, res) => {
  let loginInfo = req.body;
  let result = await adminService.sysAdminLogin(loginInfo);

  if (result.status === "Success") {
    req.session.loginAdmin = result.user;
  };
  res.send(result);
});

//logout
router.post('/logout', (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "Error",
          message: "로그아웃 실패"
        });
      }

      res.json({
        status: "Success",
        message: "로그아웃 완료"
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Error",
      message: "서버 오류"
    });
  }
});

//세션 상태확인 Test용
router.get('/me', (req, res) => {
  try {
    console.log("session:", req.session);
    if (!req.session.loginAdmin) {
      return res.json({
        status: "Fail",
        message: "로그인 안됨"
      });
    }

    res.json({
      status: "Success",
      user: req.session.loginAdmin
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Error",
      message: "서버 오류"
    });
  }
});


//조사지 Form생성
router.post(`/surveyadd`, requireAdmin ,async (req, res) => {
  let body = req.body;
  let result = await adminService.SurveyInsert(body);
  res.send(result);
});

//시스템관리자의 조사지 버전 선택하는 화면
router.get(`/surveyList`, requireAdmin, async(req,res) => {
  let result = await adminService.getSurveyVersionList();
  res.send(result);
});

//조사지 버전 사용
router.put(`/surveyActive/:verId`, requireAdmin, async (req,res) => {
  let verId = req.params.verId;
  let result = await adminService.setActiveVersion(verId);

  res.send(result);
});

//조사지 Detail조회
router.get(`/surveydetail/:verId`, requireAdmin, async (req,res) => {
  let verId = req.params.verId;
  let result = await adminService.getSurveyDetail(verId);

  res.send(result);
});

//조사지 이전버전 불러오기
router.get(`/surveyCurrent`, requireAdmin, async (req, res) => {
  let result = await adminService.getCurrentSurveyDetail();
  res.send(result);
});

module.exports = router;
