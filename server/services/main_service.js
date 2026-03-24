// main_service.js
// 메인페이지 관련 service
const mainMapper = require("../database/mappers/main_mapper.js");

// 공통코드분리 - 데이터 변환
const formatListData = (list) => {
  // 조사지 내역이 아직 없는 경우
  if (!list || list.length === 0) return [];

  // 우선순위 코드 => 등급 변환
  return list.map((item) => {
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

    // 계획서, 결과서 버튼 활성화
    item.hasPlan = item.hasPlanCount > 0 ? true : false;
    item.hasResult = item.hasResultCount > 0 ? true : false;

    return item;
  });
};

// 일반이용자
const findByUser = async (id) => {
  let list = await mainMapper.selectByUser(id);
  return formatListData(list);
};

// 기관담당자
const findByManager = async (id) => {
  let list = await mainMapper.selectByManager(id);
  return formatListData(list);
};

// 기관관리자
const findByGeneral = async (id) => {
  let list = await mainMapper.selectByGeneral(id);
  return formatListData(list);
};

module.exports = {
  findByUser,
  findByManager,
  findByGeneral,
};
