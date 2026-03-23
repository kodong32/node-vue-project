// 메인페이지 관련 service
const mainMapper = require("../database/mappers/main_mapper.js");

// 메인페이지 조사지 내역 조회
const findById = async (id) => {
  let list = await mainMapper.selectById(id);
  console.log(list.result);
  let rank = list.result;
  switch (rank) {
    case "f003":
      rank = "긴급";
      break;
    case "f002":
      rank = "중점";
      break;
    case "f001":
      rank = "계획";
      break;

    default:
      rank = "심사중";
      break;
  }
  list.result = rank;
  return list;
};

module.exports = {
  findById,
};
