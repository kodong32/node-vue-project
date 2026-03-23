//회원 관련 router
const express = require("express");
const router = express.Router();

const userService = require("../../services/user_service.js");

router.get(`/test`, async (req, res) => {
  let result = await userService.testSelect();
  res.send(result);
});

//일반이용자 회원가입<김경환, 응답결과 전달>
router.post(`/users`, async (req, res) => {
  let target = req.body;
  let result = await userService.createUser(target);
  res.send(result);
});

//기관이용자 회원가입<김경환, 응답결과 전달>
router.post(`/instiUsers`, async (req, res) => {
  let target = req.body;
  let result = await userService.createInstiUser(target);
  res.send(result);
});
router.post(`/support/add`, async (req, res) => {
  let body = req.body;
  let result = await userService.supportAdd(body);
  res.send(result);
});

module.exports = router;
