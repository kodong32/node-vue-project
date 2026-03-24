//조사지 관련 service
const surveyMapper = require("../database/mappers/survey_mapper");

//조사지 전체조회 <김민지, mapper에 있는 함수 가져와서 라우터에 결과 전달>
const findAll = async () => {
  let list = await surveyMapper.selectSurveyAll();
  return list;
};

//조사지 건별조회 <김민지, mapper에 있는 함수 가져와서 라우터에 결과 전달>
const fineInfoByNo = async (surveyNo) => {
  let detail = await surveyMapper.selectSurveyById(surveyNo);
  return detail;
};

//조사지 등록 <김민지, 26.03.24 수정 (오류 잡기, PK증가로직 추가)
const createSurvey = async (surveyObj) => {
  const { Ver_Id, G_UserId, support_id } = surveyObj;

  const createDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  const updateDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    let J_ID;
    const lastJID = await surveyMapper.getLastJID();
    J_ID = "SUV0001";
    if (lastJID && lastJID.length > 0) {
      const num = parseInt(lastJID[0].J_ID.substring(3), 10);
      J_ID = "SUV" + String(num + 1).padStart(4, "0");
    }

    // const safeVerId = Ver_Id && Ver_Id.trim() !== "" ? Ver_Id : "FORM0000";
    // const safeUserId =
    //   G_UserId && G_UserId.trim() !== "" ? G_UserId : "GUSR0000";
    // const safeSupportId =
    //   support_id && support_id.trim() !== "" ? support_id : "SUP0000";

    // 🔥 result, reason  → null 처리 (여기서 답변 저장 안 함)
    let insertData = [
      J_ID,
      Ver_Id || "FORM0000",
      G_UserId || "GUSR0000",
      support_id || "SUP0000",
      null,
      null,
      createDate,
      updateDate,
    ];

    let outcome = await surveyMapper.insertSurvey(insertData);

    return {
      status: outcome.affectedRows > 0 ? "success" : "fail",
      J_ID: J_ID,
    };
  } catch (err) {
    console.error("DB ERROR:", err);
    return { status: "fail", message: err.message };
  }
};

//조사지 답변 <김민지, 26.03.24 수정 (오류 잡기, PK증가로직 추가)
const createAnswer = async (answerObj) => {
  let { J_ID, result, reason } = answerObj;
  try {
    const answerJson = JSON.stringify({ result, reason });
    //result : Vue에서 서버로 보낸 설문 답변 데이터 (문자열 상태)
    //JSON.parse() : JSON 문자열을 JavaScript 객체/배열로 변환

    const lastAnswer = await surveyMapper.getLastlastAnswer();
    if (lastAnswer && lastAnswer.parsed) {
      const num = parseInt(lastAnswer.parsed.substring(3), 10);
      answer_id = "ANS" + String(num + 1).padStart(4, "0");
    } else {
      answer_id = "ANS0001";
    }

    const answer_id = "A" + Date.now(); // timestamp 기반으로 PK 중복 방지
    const question_id =
      "Q" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    let answerData = [answer_id, J_ID, question_id, answerJson];
    console.log("answerData", answerData);

    let result = await surveyMapper.insertSurveyAnswer(answerData);
    // Answer 테이블 insert
    return {
      status: result.affectedRows > 0 ? "Success" : "Failed",
      answer_id,
    };
  } catch (err) {
    if (err.code !== "ER_DUP_ENTRY") {
      //"ER_DUP_ENTRY" 중복 값에 대한 mariadb 에러코드
      return { status: "Failed", message: err.message };
    }
    return { status: "Failed", message: "PK 중복으로 인한 등록 실패" };
  }
};

const surveyInfo = async (data) => {
  try {
    // 1. 조사지 등록
    const lastJID = await surveyMapper.getLastJID();
    let newJID = "SUV0001";
    if (lastJID) {
      // 🔹 기존 코드는 숫자 PK로 계산, 여기서 문자열 PK 처리 추가
      const num = parseInt(lastJID.substring(3), 10); // 🔹 'SUV' 접두사 제거 후 숫자로 변환
      newJID = "SUV" + String(num + 1).padStart(4, "0"); // 🔹 새 J_ID 문자열 생성
    }

    const createDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const updateDate = createDate;

    const surveyData = [
      newJID,
      data.Ver_Id || "FORM0000",
      data.G_UserId || "GUSR0000",
      data.support_id || "SUP0000",
      JSON.stringify(data.result) || null, // 🔹 기존 null 처리에서 Vue에서 받은 result JSON 저장
      data.reason || null,
      createDate,
      updateDate,
    ];

    await surveyMapper.insertSurvey(surveyData);

    // 2. 답변 등록
    let lastAns = await surveyMapper.lastAnswer(); // 🔹 마지막 answer_id 조회
    let lastAnsIdNum = lastAns.length
      ? parseInt(lastAns[lastAns.length - 1].answer_id.substring(3), 10) // 🔹 'ANS' 접두사 제거 후 숫자 변환
      : 0; // 🔹 데이터가 없으면 0으로 초기화

    for (let ans of data.answers) {
      // 🔹 Vue에서 넘어온 answers 배열 반복
      lastAnsIdNum += 1;
      const answer_id = "ANS" + String(lastAnsIdNum).padStart(4, "0"); // 🔹 answer_id 생성

      const answerData = [answer_id, newJID, ans.question_id, ans.answer];
      await surveyMapper.insertSurveyAnswer(answerData); // 🔹 기존 selectAnswer 호출에서 insertSurveyAnswer로 변경
    }

    return { status: "success", J_ID: newJID };
  } catch (err) {
    console.error("DB ERROR:", err);
    return { status: "fail", message: err.message };
  }
};

module.exports = {
  findAll,
  fineInfoByNo,
  createSurvey,
  createAnswer,
  surveyInfo,
};
