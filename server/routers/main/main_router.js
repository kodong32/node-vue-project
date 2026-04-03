// main_router.js
// 메인페이지 관련 router
const express = require("express");
const router = express.Router();
const mainService = require("../../services/main_service.js");

// 일반이용자
// router.get("/user/:id", async (req, res) => {
//   const page = req.query.page || 1;
//   const limit = req.query.limit || 5;

//   let result = await mainService.findByUser(req.params.id, page, limit);
//   res.json(result);
// });
// 일반이용자 사이드바 검색조건 추가- 고동현
router.get("/user/:id", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  const searchOption = {
    writeDate: req.query.writeDate || "",
    applicantName: req.query.applicantName || "",
    managerName: req.query.managerName || "",
  };

  let result = await mainService.findByUser(
    req.params.id,
    page,
    limit,
    searchOption,
  );

  res.json(result);
});

// 기관담당자
// router.get("/manager/:id", async (req, res) => {
//   const page = req.query.page || 1;
//   const limit = req.query.limit || 5;

//   let result = await mainService.findByManager(req.params.id, page, limit);
//   res.json(result);
// });

//기관 담당자 사이드바 검색 조건 추가 고동현
// 기관담당자
router.get("/manager/:id", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  const searchOption = {
    writeDate: req.query.writeDate || "",
    applicantName: req.query.applicantName || "",
    managerName: req.query.managerName || "",
  };

  let result = await mainService.findByManager(
    req.params.id,
    page,
    limit,
    searchOption,
  );

  res.json(result);
});

// 기관관리자
// router.get("/general/:id", async (req, res) => {
//   const page = req.query.page || 1;
//   const limit = req.query.limit || 5;

//   let result = await mainService.findByGeneral(req.params.id, page, limit);
//   res.json(result);
// });

//기관관리자 사이드바 검색조건 추가 고동현
router.get("/general/:id", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  const searchOption = {
    writeDate: req.query.writeDate || "",
    applicantName: req.query.applicantName || "",
    managerId: req.query.managerId || "",
    managerName: req.query.managerName || "",
  };

  let result = await mainService.findByGeneral(
    req.params.id,
    page,
    limit,
    searchOption,
  );
  res.json(result);
});

router.get("/general/managers/:institutionId", async (req, res) => {
  const result = await mainService.findManagersByInstitution(
    req.params.institutionId,
  );
  res.json({ data: result });
});

module.exports = router;
