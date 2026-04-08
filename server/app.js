require("dotenv").config({ path: "./database/dbConfig.env" });

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);

//Session Token
app.use(
  session({
    secret: "my-secret-key", // 아무 문자열
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30, // 30분
    },
  }),
);

//미들웨어
// app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 테스트 api
// app.get(`/`, (req, res) => {
//   res.send(`OK`);
// });



// 서버실행
app.listen(port, () => {
  console.log(`서버 실행 http://localhost:${port}`);
});

//기능별 라우터모듈
const userRouter = require("./routers/user/user_router");
app.use("/api/user", userRouter);
//상담기록
const consultRouter = require("./routers/consult/consult_router.js");
app.use("/api/consult", consultRouter);
//조사지 등록 라우터모듈 (김민지 26.03.23 추가)
const surveyRouter = require("./routers/survey/survey_router");
app.use("/api/survey", surveyRouter);
//메인페이지 라우터모듈
const mainRouter = require("./routers/main/main_router.js");
app.use("/api/main", mainRouter);
//장애유형 라우터모듈
const disRouter = require("./routers/user/disability_router.js");
app.use("/api/dis", disRouter);
//시스템관리자
const adminRouter = require("./routers/admin/admin_router.js");
app.use("/api/admin", adminRouter);
//우선순위요청
const priorityRouter = require("./routers/survey/priority_router.js");
app.use("/api/priority", priorityRouter);
//관리자지원계획서
const generalPlanRouter = require("./routers/plan/general_plan_router.js");
app.use("/api/general/plan", generalPlanRouter);
//일반이용자지원계획서
const userPlanRouter = require("./routers/plan/user_plan_router.js");
app.use("/api/user/plan", userPlanRouter);
//관리자&담당자 지원계획서 반려 내역
const rejectedPlanRouter = require("./routers/plan/rejected_plan_router.js");
app.use("/api/rejected/plan", rejectedPlanRouter);
//관리자 지원계획서 승인&반려
const approvalPlanRouter = require("./routers/plan/approval_plan_router.js");
app.use("/api/approval/plan", approvalPlanRouter);
//담당자 지원결과서 등록
const resultPlanRouter = require("./routers/plan/result_plan_router.js");
app.use("/api/result/plan", resultPlanRouter);
//기관담당자 지원계획서
const managerPlanRouter = require("./routers/plan/plan_router.js");
app.use("/api/manager/plan", managerPlanRouter);
//기관관리자 지원결과서 승인&반려
const approvalResultRouter = require("./routers/plan/approval_result_router.js");
app.use("/api/approval/result", approvalResultRouter);
//공지사항
const noticeRouter = require("./routers/notice/notice_router.js");
app.use("/api/notice", noticeRouter);
//일반이용자 승인 결과서 보기
const userResultRouter = require("./routers/plan/user_result_router.js");
app.use("/api/user/result", userResultRouter);
//시스템관리자 기관 등록
const AdminInstitutionRouter = require("./routers/admin/admin_institution_router.js");
app.use("/api/admin/institution", AdminInstitutionRouter);
//시스템관리자 기관관리자 등록
const AdminInstiUserRouter = require("./routers/admin/admin_instiuser_router.js");
app.use("/api/admin/instiuser", AdminInstiUserRouter);

const path = require('path');
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/',function (req,res, next) {
  res.sendFile(path.join(__dirname, './public', "index.html"));
});

app.use((req,res) => {
  res.status(404).sendFile(path.join(__dirname, './public',"index.html"));
});
