const express = require("express");
const router = express.Router();


const disabilityService = require("../../services/disability_service.js")

router.get(`/disList`, async (req, res) => {
  let result = await disabilityService.getDisList();
  res.send(result);
});

router.get(`/disMidList`, async (req, res) => {
  let { bCodes } = req.query;

  //bCodes 없다면 빈 배열 리턴
  if (!bCodes) {
    return res.json([]);
  }

  //bCodes가 배열 형태가 아니라면, 배열 형태로 변환
  if (!Array.isArray(bCodes)) {
    bCodes = [bCodes];
  }

  let result = await disabilityService.getMidList(bCodes);
  res.send(result);
});



module.exports = router;
