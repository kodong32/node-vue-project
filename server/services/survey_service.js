//조사지 관련 service
const surveyMapper = require("../database/mappers/survey_mapper");

//조사지 전체조회 <김민지, mapper에 있는 함수 가져와서 라우터에 결과 전달>
const findAll = async () => {
  let list = await surveyMapper.selectSurveyAll();
  return list;
};

//조사지 건별조회 <김민지, mapper에 있는 함수 가져와서 라우터에 결과 전달>
const findInfoByNo = async (J_ID) => {
  let detail = await surveyMapper.selectSurveyById(J_ID);
  return detail;
};

//조사지 등록 <김민지, 26.03.24 수정 (오류 잡기, PK증가로직 추가)
// const createSurvey = async (surveyObj) => {
//   const { Ver_Id, G_UserId, support_id } = surveyObj;

//   const createDate = new Date().toISOString().slice(0, 19).replace("T", " ");
//   const updateDate = new Date().toISOString().slice(0, 19).replace("T", " ");

//   try {
//     let J_ID;
//     const lastJID = await surveyMapper.getLastJID();
//     J_ID = "SUV0001";
//     if (lastJID && lastJID.length > 0) {
//       const num = parseInt(lastJID[0].J_ID.substring(3), 10);
//       J_ID = "SUV" + String(num + 1).padStart(4, "0");
//     }

//     // const safeVerId = Ver_Id && Ver_Id.trim() !== "" ? Ver_Id : "FORM0000";
//     // const safeUserId =
//     //   G_UserId && G_UserId.trim() !== "" ? G_UserId : "GUSR0000";
//     // const safeSupportId =
//     //   support_id && support_id.trim() !== "" ? support_id : "SUP0000";

//     // 🔥 result, reason  → null 처리 (여기서 답변 저장 안 함)
//     let insertData = [
//       J_ID,
//       Ver_Id || "FORM0000",
//       G_UserId || "GUSR0000",
//       support_id || "SUP0000",
//       null,
//       null,
//       createDate,
//       updateDate,
//     ];

//     let outcome = await surveyMapper.insertSurvey(insertData);

//     return {
//       status: outcome.affectedRows > 0 ? "success" : "fail",
//       J_ID: J_ID,
//     };
//   } catch (err) {
//     console.error("DB ERROR:", err);
//     return { status: "fail", message: err.message };
//   }
// };

// //조사지 답변 <김민지, 26.03.24 수정 (오류 잡기, PK증가로직 추가)
// const createAnswer = async (answerObj) => {
//   let { answer_id, J_ID, question_id, result, reason } = answerObj;
//   try {
//     const answer = JSON.stringify({ result, reason });
//     //result : Vue에서 서버로 보낸 설문 답변 데이터 (문자열 상태)
//     //JSON.parse() : JSON 문자열을 JavaScript 객체/배열로 변환

//     const lastAnswer = await surveyMapper.lastAnswer();
//     if (lastAnswer && lastAnswer.parsed) {
//       const num = parseInt(lastAnswer.parsed.substring(3), 10);
//       answer_id = "ANS" + String(num + 1).padStart(4, "0");
//     } else {
//       answer_id = "ANS0001";
//     }

//     // const answer_id = "A" + Date.now(); // timestamp 기반으로 PK 중복 방지
//     // const question_id =
//     //   "Q" +
//     //   Math.floor(Math.random() * 10000)
//     //     .toString()
//     //     .padStart(4, "0");

//     let answerData = [answer_id, J_ID, question_id, answer];
//     console.log("answerData", answerData);

//     let response = await surveyMapper.insertSurveyAnswer(answerData);
//     // Answer 테이블 insert
//     return {
//       status: response.affectedRows > 0 ? "Success" : "Failed",
//       answer_id,
//     };
//   } catch (err) {
//     if (err.code !== "ER_DUP_ENTRY") {
//       //"ER_DUP_ENTRY" 중복 값에 대한 mariadb 에러코드
//       return { status: "Failed", message: err.message };
//     }
//     return { status: "Failed", message: "PK 중복으로 인한 등록 실패" };
//   }
// };

const surveyInfo = async (data) => {
  if (!data.G_UserId) {
    console.error("G_UserId가 없습니다!");
    throw new Error("G_UserId 필수"); // ← throw로 에러 던지기
  }

  try {
    // 1. 조사지 문항 + 답변 전체를 한 번에 처리
    const lastJID = await surveyMapper.getLastJID();

    let newJID = "SUV0001";

    if (lastJID && lastJID.length > 0) {
      // 🔹 기존 코드는 숫자 PK로 계산, 여기서 문자열 PK 처리 추가
      const lastId = lastJID[0].J_ID;
      const num = parseInt(lastId.substring(3), 10); // 'SUV0001' → 1
      newJID = "SUV" + String(num + 1).padStart(4, "0"); // 새 J_ID 문자열 생성
    }

    const createDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const updateDate = createDate;

    if (!data.G_UserId) {
      console.error("G_UserId가 없습니다!");
      return res.status(400).send({ error: "G_UserId 필수" });
    }
    if (!data.Ver_Id) {
      console.error("Ver_Id가 없습니다!");
      return res.status(400).send({ error: "Ver_Id 필수" });
    }

    const [verRow] = await db.query(
      "SELECT Ver_Id FROM SurveyForm_Tbl WHERE use_yn = 'Y' ORDER BY created_at DESC LIMIT 1",
    );
    const Ver_Id = verRow?.Ver_Id;
    if (!Ver_Id) throw new Error("사용 중인 Ver_Id가 없습니다");

    const surveyData = [
      newJID,
      Ver_Id,
      data.G_UserId,
      data.support_id || "",
      data.result || null, //기존 null 처리에서 Vue에서 받은 result JSON 저장
      data.reason || null,
      createDate,
      updateDate,
    ];

    console.log("DEBUG INSERT SURVEY:", surveyData);
    console.log("G_UserId 전송값:", data.G_UserId);

    // Survey_Tbl에 설문 기본 정보 저장
    await surveyMapper.insertSurvey(surveyData);

    // 2. 답변 등록
    let lastAns = await surveyMapper.lastAnswer();

    let lastAnsIdNum = 0;
    if (lastAns && lastAns.length > 0) {
      const lastId = lastAns[0].answer_id; // 🔥 기존: lastAns[lastAns.length - 1]
      lastAnsIdNum = parseInt(lastId.substring(3), 10); // 'ANS0001' → 1
    }

    // for (let ans of data.answers) {
    //   // Vue에서 넘어온 answers 배열 반복
    //   lastAnsIdNum += 1;
    //   const answer_id = "ANS" + String(lastAnsIdNum).padStart(4, "0"); // answer_id 생성

    //   const answerData = [answer_id, newJID, ans.question_id, ans.answer];
    //   await surveyMapper.insertSurveyAnswer(answerData); // 기존 selectAnswer 호출에서 insertSurveyAnswer로 변경
    // }

    if (!data.answers || data.answers.length === 0) {
      throw new Error("답변 데이터 없음");
    }

    // 1. answer 값들을 하나의 문자열로 합침 ("예,예,아니오,...")
    const answerString = data.answers
      .map((ans) => ans.answer) // 각 answer 값만 꺼냄
      .join(","); // 콤마로 합침

    // 2. question_id는 하나만 사용 (첫 번째 질문 기준)
    const firstQuestionId = data.answers[0].question_id;

    // 3. answer_id는 1개만 생성 (기존처럼 증가 로직 유지)
    lastAnsIdNum += 1;
    const answer_id = "ANS" + String(lastAnsIdNum).padStart(4, "0");

    // 4. insert도 1번만 실행 (핵심 수정 부분)
    const answerData = [
      answer_id, // 생성된 answer_id
      newJID, // 조사지 ID
      firstQuestionId, // 대표 question_id
      answerString, // "예,예,아니오,..." 형태로 저장
    ];

    await surveyMapper.insertSurveyAnswer(answerData);

    return { status: "success", J_ID: newJID };
  } catch (err) {
    console.error("DB ERROR:", err);
    return { status: "fail", message: err.message };
  }
};

//조사지 문항에 대한 답변 <김민지, 26.03.24 추가>
const selectItemsByJID = async (id) => {
  try {
    const questions = await surveyMapper.selectItemsByJID(id);
    return questions || [];
  } catch (err) {
    console.error("Service error:", err);
    return [];
  }
};

//일반이용자가 추가한 지원대상자 정보 <김민지, 260326>
const SupportById = async (id) => {
  try {
    const rows = await surveyMapper.SupportById(id);
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  findAll,
  findInfoByNo,
  surveyInfo,
  selectItemsByJID,
  SupportById,
};
