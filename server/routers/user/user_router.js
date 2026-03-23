//회원 관련 router
const express = require("express");
const router = express.Router();

const userService = require("../../services/user_service.js");

router.get(`/test`, async (req, res) => {
  let result = await userService.testSelect();
  res.send(result);
});

router.post(`/support/add`, async (req, res) => {
  let body = req.body;
  let result = await userService.supportAdd(body);
  res.send(result);
});

module.exports = router;
