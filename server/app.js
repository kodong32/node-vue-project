require("dotenv").config({ path: "./database/dbConfig.env" });

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

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
