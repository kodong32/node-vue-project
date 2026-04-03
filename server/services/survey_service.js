//조사지 관련 service
const surveyMapper = require("../database/mappers/survey_mapper.js");

//사이드바-남/여 공통코드
const gender = async () => {
  let list = await surveyMapper.gender();
  return list;
};

//지원대상자 리스트
const support = async () => {
  let list = await surveyMapper.support();
  return list;
};

//폼 장애유형 대 선택
const description = async () => {
  let major = await surveyMapper.description();
  return major;
};

//폼 장애유형 중 선택
const descriptionMiddle = async (codes) => {
  const allMiddle = await surveyMapper.descriptionMiddle();

  if (!codes) {
    return allMiddle;
  }

  return allMiddle.filter((m) => {
    const targetCodes = Array.isArray(codes) ? codes : codes.split(",");
    return m.j_Code && targetCodes.includes(m.j_Code);
  });
};

//조사지 등록
const serveyAdd = async (info) => {
  let add = await surveyMapper.serveyAdd(info);
  return add;
};

//조사지 등록 시 surveyJId 마지막 row를 기준으로 pk 생성
const surveyJId = async () => {
  const result = await surveyMapper.surveyJId();

  let rows = Array.isArray(result[0]) ? result[0] : result;

  let newJId = "SUV0001";

  if (rows && rows.length > 0) {
    const lastId = rows[0].J_ID || rows[0].j_id;

    if (lastId) {
      const lastNum = parseInt(lastId.replace("SUV", ""), 10);
      const nextNum = lastNum + 1;
      newJId = "SUV" + String(nextNum).padStart(4, "0");
    }
  }

  console.log("최종 생성된 ID:", newJId);
  return newJId;
};

//등록시 답변 데이터
const answerAdd = async (info) => {
  let answer = await surveyMapper.answerAdd(info);
  return answer;
};

//조사지 답변 마지막 row를 기준으로 pk 생성
const lastAnswer = async (info) => {
  let last = await surveyMapper.lastAnswer(info);
  return last;
};

//문항 가져오기
const items = async (Ver_Id) => {
  let item = await surveyMapper.items(Ver_Id);
  return item;
};

//상세조회
const surveyDetail = async (surveyId, userId) => {
  let detail = await surveyMapper.surveyDetail(surveyId, userId);
  return detail;
};

//타이틀 코드
const title = async () => {
  let detail = await surveyMapper.title();
  return detail;
};

//조사지 답변 조회
const answerSelect = async (id) => {
  let select = await surveyMapper.answerSelect(id);
  return select;
};

module.exports = {
  gender,
  support,
  description,
  descriptionMiddle,
  serveyAdd,
  surveyJId,
  answerAdd,
  lastAnswer,
  items,
  surveyDetail,
  title,
  answerSelect,
};
