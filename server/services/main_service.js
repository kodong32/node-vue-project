// main_service.js
// 메인페이지 관련 service
const mainMapper = require("../database/mappers/main_mapper.js");

// 메인페이지 조사지 내역 조회
const findByUserId = async (id) => {
  let list = await mainMapper.selectByUserId(id);

  if (!list || list.length == 0) return [];
  // 우선순위코드 => 등급
  let formattedList = list.map((item) => {
    let rankName = "";

    switch (item.priorityCode) {
      case "f003":
        rankName = "긴급";
        break;
      case "f002":
        rankName = "중점";
        break;
      case "f001":
        rankName = "계획";
        break;
      default:
        rankName = "심사중";
        break;
    }

    item.priorityCode = rankName;
    item.hasPlan = item.planId ? true : false;
    item.hasResult = item.resultId ? true : false;

    return item;
  });

  return formattedList;
};

module.exports = {
  findByUserId,
};
