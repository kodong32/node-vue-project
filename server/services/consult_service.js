//상담기록 관련 service
const consultMapper = require("../database/mappers/consult_mapper");

//전체조회
const findAll = async () => {
  let list = await consultMapper.consultList();
  return list;
};

//폼 장애유형 선택
const description = async () => {
  let major = await consultMapper.description();
  return major;
};

module.exports = { findAll, description };
