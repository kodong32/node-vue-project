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

//지원 대상자 등록
router.post(`/support/add`, async (req, res) => {
  let body = req.body;
  let result = await userService.supportAdd(body);
  res.send(result);
});

//지원 대상자 수정
router.put(`/support/:supId`, async(req, res) => {
  let supId = req.params.supId;
  let body = req.body;
  let result = await userService.supUpdate(supId,body);
  res.send(result);
});

//지원 대상자 삭제
router.delete(`/support/:supId`, async(req,res) => {
  let supId = req.params.supId;
  let result = await userService.supDelete(supId);
  res.send(result);
});

//일반사용자 마이페이지 지원 대상자 목록 호출
router.get(`/support/supList/:guserId`, async(req,res) => {
  let loginParams = req.params.guserId;
  let result = await userService.getSupportList(loginParams);
  res.send(result);
});
module.exports = router;
