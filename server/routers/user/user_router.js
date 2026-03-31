//회원 관련 router
const express = require("express");
const router = express.Router();

const userService = require("../../services/user_service.js");

const {
  requireUser,
  requireSameUser,
  requireSameGUser,
} = require("../../middlewares/generalUserMiddleware.js");

router.get(`/test`, async (req, res) => {
  let result = await userService.testSelect();
  res.send(result);
});

//일반이용자 회원가입<김경환, 응답결과 전달>
router.post(`/users`, async (req, res) => {
  let target = req.body;
  console.log(target);
  let result = await userService.createUser(target);
  console.log(result);
  res.send(result);
});

//기관이용자 회원가입<김경환, 응답결과 전달>
router.post(`/instiUsers`, async (req, res) => {
  let target = req.body;
  let result = await userService.createInstiUser(target);
  res.send(result);
});

//지원 대상자 등록
router.post(`/support/add`, requireUser, async (req, res) => {
  let body = req.body;
  let result = await userService.supportAdd(body);
  res.send(result);
});

//지원 대상자 수정
router.put(`/support/:supId`, requireUser, async (req, res) => {
  let supId = req.params.supId;
  let body = req.body;
  let result = await userService.supUpdate(supId, body);
  res.send(result);
});

//지원 대상자 삭제
router.delete(`/support/:supId`, requireUser, async (req, res) => {
  let supId = req.params.supId;
  let result = await userService.supDelete(supId);
  res.send(result);
});

//일반 사용자 마이페이지 접속
router.get(`/info/:userId`, requireUser, requireSameUser, async (req, res) => {
  let userId = req.params.userId;
  let result = await userService.getUserInfo(userId);

  res.send(result);
});

//일반사용자 마이페이지 지원 대상자 목록 호출
router.get(
  `/support/supList/:guserId`,
  requireUser,
  requireSameGUser,
  async (req, res) => {
    let loginParams = req.params.guserId;
    let result = await userService.getSupportList(loginParams);
    res.send(result);
  },
);

//로그인확인(김경환 2026.03.25)
router.post(`/login`, async (req, res) => {
  let body = req.body;
  console.log(body);
  let result = await userService.confirmUser(body.id, body.password);

  //session추가 26.03.27 고동현
  if (result.success) {
    req.session.user = {
      G_UserId: result.user.G_UserId,
      institution_id: result.user.institution_id,
      name: result.user.name,
      id: result.user.id,
      tel: result.user.tel,
      email: result.user.email,
    };
  }
  console.log("session user :", req.session.user);
  res.send(result);
});

//Router Gaurd에서 일반이용자 로그인 여부 확인을 위한 session Check Api 26.03.27 고동현추가
router.get("/session-check", (req, res) => {
  if (req.session.user) {
    res.send({
      success: true,
      isLogin: true,
      user: req.session.user,
    });
  } else {
    res.send({
      success: false,
      isLogin: false,
      user: null,
    });
  }
});

//기관
router.post(`/ilogin`, async (req, res) => {
  let body = req.body;
  console.log(body);
  let result = await userService.confirmInstiUser(body.id, body.password);

  //session 추가 26.03.27 고동현 추가
  if (result.success) {
    req.session.loginInstUser = {
      I_UserId: result.user.I_UserId,
      institution_id: result.user.institution_id,
      name: result.user.name,
      id: result.user.id,
      tel: result.user.tel,
      role: result.user.roll,
    };
  }
  res.send(result);
});

//Router Gaurd에서 기관 이용자 로그인 여부 확인을 위한 session Check Api 26.03.27 고동현추가
router.get("/isession-check", (req, res) => {
  if (req.session.loginInstUser) {
    return res.send({
      success: true,
      isLogin: true,
      user: req.session.loginInstUser,
    });
  }

  res.send({
    success: false,
    isLogin: false,
    user: null,
  });
});

//일반사용자 로그아웃
router.post(`/logout`, async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "error",
          message: "로그아웃 실패",
        });
      }
      res.json({
        status: "success",
        message: "로그아웃 완료",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "서버 오류",
    });
  }
});

// router.get(`/userme`, async (req, res) => {
//   try {
//     console.log("session:", req.session);
//     if (!req.session.loginUser) {
//       return res.json({
//         status: "fail",
//         message: "로그인 안됨",
//       });
//     }
//     res.json({
//       status: "success",
//       user: req.seesion.loginUser,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       status: "error",
//       message: "서버 오류",
//     });
//   }
// });

// //기관
router.post(`/ilogout`, async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "error",
          message: "로그아웃 실패",
        });
      }
      res.json({
        status: "success",
        message: "로그아웃 완료",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "서버 오류",
    });
  }
});

// router.get(`/insitime`, async (req, res) => {
//   try {
//     console.log("session:", req.session);
//     if (!req.session.loginUser) {
//       return res.json({
//         status: "fail",
//         message: "로그인 안됨",
//       });
//     }
//     res.json({
//       status: "success",
//       user: req.seesion.loginUser,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       status: "error",
//       message: "서버 오류",
//     });
//   }
// });

//기관담당자 조회(김경환 20260331)
router.get(`/instiUsers/:roll`, async (req, res) => {
  let target = req.params.roll;
  let result = await userService.getManagerList(target);
  res.send(result);
});

//이용자 승인 및 대기(김경환 20260331)
router.get("/wait-users", async (req, res) => {
  // 기관관리자 승인 접근
  const instId = req.session.loginInstUser.institution_id;

  const result = await userService.waitUser(instId);

  res.send(result);
});

router.patch("/approve/:id", async (req, res) => {
  if (!req.session.loginInstUser) {
    return res.status(401).send("로그인 필요");
  }
  if (req.session.loginInstUser.role !== "a002") {
    return res.status(403).send("권한없음");
  }

  await userService.agreeUser(req.params.id);
  res.send({ status: "success" });
});
module.exports = router;
