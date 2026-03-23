// 메인페이지 관련 service
const mainMapper = require("../database/mappers/main_mapper.js");

// 메인페이지 조사지 내역 조회
const findById = async (id) => {
  let list = await mainMapper.selectById(id);
  return list;
};

module.exports = {
  findById,
};
