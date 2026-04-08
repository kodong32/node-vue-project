//회원 관련 router
const express = require("express");
const router = express.Router();
const uploadUser = require("../../middlewares/uploadFile_SignIn.js");
const downloadFileUser = require("../../middlewares/downloadFile_User.js");

const userService = require("../../services/user_service.js");

const {
  requireUser,
  requireSameUser,
  requireSameGUser,
} = require("../../middlewares/generalUserMiddleware.js");

const {
  requireInstUser,
  requireInstRole,
} = require("../../middlewares/instiUserMiddleware.js");

router.get(`/test`, async (req, res) => {
  let result = await userService.testSelect();
  res.send(result);
});

//일반이용자 회원가입<김경환, 응답결과 전달>
// router.post(`/users`, async (req, res) => {
//   let target = req.body;
//   console.log(target);
//   let result = await userService.createUser(target);
//   console.log(result);
//   res.send(result);
// });
//일반사용자 회원가입 파일 등록 포함 수정 고동현
router.post(
  `/users`,
  uploadUser.fields([
    { name: "document1", maxCount: 1 },
    { name: "document2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let target = req.body;
      const files = req.files || {};

      target.document1 = files.document1?.[0]?.filename || null;
      target.document2 = files.document2?.[0]?.filename || null;

      console.log("req.body :", target);
      console.log("req.files :", files);

      let result = await userService.createUser(target);
      console.log(result);
      res.send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: "Failed",
        message: "회원가입 중 파일 업로드 오류",
      });
    }
  },
);

//회원가입 파일 다운로드 라우트
router.get("/download/user/:fileName", downloadFileUser);

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

//일반사용자 마이페이지 본인정보 수정
router.put(
  `/info`,
  requireUser,
  uploadUser.fields([
    { name: "document1", maxCount: 1 },
    { name: "document2", maxCount: 1 },
  ]),
  async (req, res) => {
    const G_UserId = req.session.user.G_UserId;
    const body = req.body;
    const files = req.files;

    body.document1 = files?.document1
      ? files.document1[0].filename
      : body.document1 || null;
    body.document2 = files?.document2
      ? files.document2[0].filename
      : body.document2 || null;

    const result = await userService.updateUserInfo(G_UserId, body);

    res.send(result);
  },
);

//일반사용자 비밀번호 변경
router.put(`/password`, requireUser, async (req, res) => {
  const G_UserId = req.session.user.G_UserId;
  console.log(G_UserId);
  const result = await userService.changePassword(G_UserId, req.body);

  res.send(result);
});

//일반사용자 마이페이지 기관검색
router.get(`/institutions`, requireUser, async (req, res) => {
  const { sido, sigungu, keyword } = req.query;
  const result = await userService.searchInstitutions({
    sido,
    sigungu,
    keyword,
  });

  res.send(result);
});

//회원가입 기관선택
router.get(`/institution`, async (req, res) => {
  const { sido, sigungu, keyword } = req.query;
  const result = await userService.searchInstitutions({
    sido,
    sigungu,
    keyword,
  });
  res.send(result);
});

// 로그인확인(김경환 2026.03.25)
router.post(`/login`, async (req, res) => {
  let body = req.body;
  // console.log("🔑 로그인 시도 ID:", body.id);

  // 서비스에서 성공여부와 이유(reason)를 받아옴
  let result = await userService.confirmUser(body.id, body.password);

  req.session.save(err => {
    console.log(err);
  })

  // session추가 26.03.27 고동현
  if (result.success) {
    req.session.user = {
      G_UserId: result.user.G_UserId,
      institution_id: result.user.institution_id,
      name: result.user.name,
      id: result.user.id,
      tel: result.user.tel,
      email: result.user.email,
      role: "a004",
    };
    console.log("✅ session user :", req.session.user);
  } else {
    // 실패 시 왜 실패했는지 콘솔에 출력 (디버깅용)
    console.log(
      "❌ 로그인 불가 사유:",
      result.reason || "비밀번호/아이디 불일치",
    );
  }

  // 🌟 프론트엔드로 성공/실패 여부와 사유(reason)를 담아서 보냅니다!
  res.send(result);
});

//일반회원 탈퇴
router.put("/withdraw", async (req, res) => {
  const { G_UserId } = req.body;
  const result = await userService.withdrawUser(G_UserId);

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
  let result = await userService.confirmInstiUser(body.id, body.password);

  req.session.save(err => {
    console.log(err);
  })


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
    console.log("✅ session loginInstUser :", req.session.loginInstUser);
  } else {
    console.log(
      "❌ 기관 로그인 불가 사유:",
      result.reason || "비밀번호/아이디 불일치",
    );
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

//기관담당자 조회(김경환 20260331)
router.get(`/instiUsers/:roll/:institution_id`, async (req, res) => {
  try {
    const { roll, institution_id } = req.params;

    let result = await userService.getManagerList(roll, institution_id);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//이용자 승인 및 대기(김경환 20260331)
router.get("/wait-users", async (req, res) => {
  // 기관관리자 승인 접근
  if (!req.session.loginInstUser) {
    return res.status(401).send("로그인 필요");
  }
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

//header 접근용 session
// 현재 로그인 사용자 통합 조회
router.get("/auth/me", (req, res) => {
  try {
    // 시스템 관리자
    if (req.session.loginAdmin) {
      return res.send({
        success: true,
        isLogin: true,
        userType: "ADMIN",
        user: {
          userId: req.session.loginAdmin.adminId, // ADM0000
          name: "시스템관리자",
          loginId: req.session.loginAdmin.id, // admin1
          role: req.session.loginAdmin.role, // a001
          institutionId: null,
          tel: null,
          email: null,
        },
      });
    }

    // 일반 이용자
    if (req.session.user) {
      return res.send({
        success: true,
        isLogin: true,
        userType: "USER",
        user: {
          userId: req.session.user.G_UserId,
          institutionId: req.session.user.institution_id,
          name: req.session.user.name,
          loginId: req.session.user.id,
          tel: req.session.user.tel,
          email: req.session.user.email,
          role: req.session.user.role,
        },
      });
    }

    // 기관 이용자
    if (req.session.loginInstUser) {
      return res.send({
        success: true,
        isLogin: true,
        userType: "INST",
        user: {
          userId: req.session.loginInstUser.I_UserId,
          institutionId: req.session.loginInstUser.institution_id,
          name: req.session.loginInstUser.name,
          loginId: req.session.loginInstUser.id,
          tel: req.session.loginInstUser.tel,
          email: null,
          role: req.session.loginInstUser.role, // MANAGER or GENERAL
        },
      });
    }

    // 로그인 안됨
    return res.send({
      success: false,
      isLogin: false,
      userType: null,
      user: null,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      isLogin: false,
      message: "세션 확인 중 오류 발생",
    });
  }
});

//기관담당자 마이페이지
router.get(`/instiUsersinfo`, requireInstRole, async (req, res) => {
  const instId = req.session.loginInstUser.I_UserId; //PK값임

  const result = await userService.getInstInfo(instId);
  res.send(result);
});

//기관담당자 담당 지원대상자List
router.get(`/instiSupportList`, requireInstRole, async (req, res) => {
  const instId = req.session.loginInstUser.I_UserId;
  const result = await userService.getSupporterList(instId);

  res.send(result);
});

//기관담당자 비밀번호 변경
router.put(`/instiUsersPassword`, requireInstRole, async (req, res) => {
  const instId = req.session.loginInstUser.I_UserId; //PK값임
  const result = await userService.changeInstiUserPassword(instId, req.body);

  res.send(result);
});

router.put("/instiUsersinfo", requireInstRole, async (req, res) => {
  const instId = req.session.loginInstUser.I_UserId; //PK값임
  const result = await userService.updateInstiUserInfo(instId, req.body);

  res.send(result);
});

//해당기관 가져오기
router.get(`/institutionInfo`, requireInstRole, async (req, res) => {
  const iUserId = req.session.loginInstUser.I_UserId;
  const result = await userService.getInstInfoById(iUserId);

  res.send(result);
});

//기관정보 수정
router.put(`/insti/update`, requireInstRole, async (req, res) => {
  const instId = req.session.loginInstUser.I_UserId;
  const body = req.body;

  const result = await userService.updateInstInfo(instId, body);
  res.send(result);
});

//기관 내 담당자 확인
router.get(`/managerlist`, requireInstRole, async (req, res) => {
  const institutionId = req.query.institutionId;
  const result = await userService.getManagerListByInstitution(institutionId);

  res.send(result);
});

//기관 관리자 정보 수정
router.put('/instiUserinfo', async (req, res) => {
  const body = req.body;

  const result = await userService.updateInstiUserInfo(body);
  res.send(result);
});



//정,부담당자 확인 김경환
router.get(`/managerlist2`, requireInstRole, async (req, res) => {
  const instId = req.session.loginInstUser.institution_id; //기관PK
  const result = await userService.getMangerMainSubList(instId);

  console.log(result);
  res.send(result);
});

// 담당자 배정현황 조회
router.get("/manager/assignedSupport", requireInstRole, async (req, res) => {
  const loginIUserId = req.session.loginInstUser.I_UserId;
  const institutionId = req.query.institutionId;
  const targetIUserId = req.query.iUserId;

  const result = await userService.getAssignedSupportListByManager(
    loginIUserId,
    institutionId,
    targetIUserId,
  );

  res.send(result);
});

router.put("/assign", async (req, res) => {
  const { I_UserId1, I_UserId2, support_id } = req.body;

  await userService.updateManager(I_UserId1, I_UserId2, support_id);

  res.send({ success: true });
});

router.get("/wait-insti-users", async (req, res) => {
  // 기관관리자 승인 접근
  if (!req.session.loginInstUser) {
    return res.status(401).send("로그인 필요");
  }

  const instId = req.session.loginInstUser.institution_id;

  const result = await userService.waitInstiUser(instId);

  res.send(result);
});

router.patch("/approve-manager/:id", async (req, res) => {
  if (!req.session.loginInstUser) {
    return res.status(401).send("로그인 필요");
  }
  if (req.session.loginInstUser.role !== "a002") {
    return res.status(403).send("권한없음");
  }

  await userService.agreeInstiUser(req.params.id);
  res.send({ status: "success" });
});

router.get("/support/by-jid/:jid", async (req, res) => {
  const jid = req.params.jid;

  const result = await userService.getSupportInstitutionByJid(jid);

  res.json(result);
});

router.patch("/reject/:id", async (req, res) => {
  if (!req.session.loginInstUser) {
    return res.status(401).send("로그인 필요");
  }
  if (req.session.loginInstUser.role !== "a002") {
    return res.status(403).send("권한없음");
  }
  await userService.rejectUser(req.params.id);
  res.send({ status: "success" });
});

router.patch("/reject-manager/:id", async (req, res) => {
  if (!req.session.loginInstUser) {
    return res.status(401).send("로그인 필요");
  }
  if (req.session.loginInstUser.role !== "a002") {
    return res.status(403).send("권한없음");
  }
  await userService.rejectInstiUser(req.params.id);
  res.send({ status: "success" });
});

router.get("/checkid/:id", async (req, res) => {
  const id = req.params.id;
  const result = await userService.userIdCheck(id);
  res.send(result);
});

router.get("/checkinstiid/:id", async (req, res) => {
  const institution_id = req.params.id;
  const result = await userService.instiIdCheck(institution_id);
  res.send(result);
});
module.exports = router;
