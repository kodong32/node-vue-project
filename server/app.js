require("dotenv").config({ path: "./database/dbConfig.env" });

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = 3000;

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
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 테스트 api
app.get(`/`, (req, res) => {
  res.send(`OK`);
});

// 서버실행
app.listen(port, () => {
  console.log(`서버 실행 http://localhost:${port}`);
});

//기능별 라우터모듈
const userRouter = require("./routers/user/user_router");
app.use("/user", userRouter);
//조사지 등록 라우터모듈 (김민지 26.03.23 추가)
const surveyRouter = require("./routers/survey/survey_router");
app.use("/survey", surveyRouter);
//메인페이지 라우터모듈
const mainRouter = require("./routers/main/main_router.js");
app.use("/main", mainRouter);
//장애유형 라우터모듈
const disRouter = require("./routers/user/disability_router.js");
app.use("/dis", disRouter);
//시스템관리자
const adminRouter = require("./routers/admin/admin_router.js");
app.use("/admin", adminRouter);
//우선순위요청
const priorityRouter = require("./routers/survey/priority_router.js");
app.use("/priority", priorityRouter);
//관리자지원계획서
const generalPlanRouter = require("./routers/plan/general_plan_router.js");
app.use("/general/plan", generalPlanRouter);
//일반이용자지원계획서
const userPlanRouter = require("./routers/plan/user_plan_router");
app.use("/user/plan", userPlanRouter);
