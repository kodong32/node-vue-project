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

//조사지 등록 함수 <김민지, 2026.03.30 최종 완성>
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
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getQuestionsByJID = async (id) => {
  try {
    const rows = await surveyMapper.getQuestionsByJID(id);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  findAll,
  findInfoByNo,
  surveyInfo,
  selectItemsByJID,
  SupportById,
  getQuestionsByJID,
};
