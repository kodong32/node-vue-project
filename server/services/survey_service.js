//조사지 관련 service
const surveyMapper = require("../database/mappers/survey_mapper.js");

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
    return { status: "fail", message: "G_UserId 필수" };
  }

  try {
    const lastJID = await surveyMapper.getLastJID();

    let newJID = "SUV0001";

    if (lastJID && lastJID.length > 0) {
      const lastId = lastJID[0].J_ID;
      const num = parseInt(lastId.substring(3), 10);
      newJID = "SUV" + String(num + 1).padStart(4, "0");
    }

    const createDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const updateDate = createDate;

    if (!data.G_UserId) {
      throw new Error("G_UserId 필수");
    }
    if (!data.Ver_Id) {
      throw new Error("Ver_Id 필수");
    }

    const getActiveVerId = async () => {
      const rows = await surveyMapper.getActiveVerId();
      console.log("rows:", rows);

      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0].Ver_Id;
      }

      if (rows && rows.Ver_Id) {
        return rows.Ver_Id;
      }

      throw new Error("사용 중인 Ver_Id가 없습니다");
    };

    const Ver_Id = await getActiveVerId();

    const now = new Date();
    const created_at = now.toISOString().slice(0, 19).replace("T", " ");
    const updated_at = created_at;

    const surveyData = [
      newJID,
      data.G_UserId.trim(),
      data.support_id || null,
      null,
      null,
    ];

    await surveyMapper.insertSurvey(surveyData);

    let lastAns = await surveyMapper.lastAnswer();

    let lastAnsIdNum = 0;
    if (lastAns && lastAns.length > 0) {
      const lastId = lastAns[0].answer_id;
      lastAnsIdNum = parseInt(lastId.substring(3), 10);
    }

    if (!data.answers || data.answers.length === 0) {
      throw new Error("답변 데이터 없음");
    }

    const answerString = data.answers.map((ans) => ans.answer).join(",");
    const firstQuestionId = data.answers[0].question_id;

    lastAnsIdNum += 1;
    const answer_id = "ANS" + String(lastAnsIdNum).padStart(4, "0");
    const answerData = [answer_id, newJID, firstQuestionId, answerString];

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
    console.log("DB에서 가져온 행 개수:", rows.length);
    return rows;
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
