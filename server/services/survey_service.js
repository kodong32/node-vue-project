//조사지 관련 service
const surveyMapper = require("../database/mappers/survey_mapper");

//조사지 전체조회 <김민지, mapper에 있는 함수 가져와서 라우터에 결과 전달>
const findAll = async () => {
  let list = await surveyMapper.selectSurveyAll();
  console.log("list:", list);
  return list;
};

module.exports = { findAll };
