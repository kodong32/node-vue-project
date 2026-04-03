// main_service.js
// 메인페이지 관련 service
const mainMapper = require("../database/mappers/main_mapper.js");

// 공통코드분리 - 데이터 변환
const formatListData = (list, userRole) => {
  // 조사지 내역이 아직 없는 경우
  if (!list || list.length === 0) return [];

  // 우선순위 코드 => 등급 변환
  // 날짜 포맷팅
  return list.map((item) => {
    if (item.registerDate) {
      const date = new Date(item.registerDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      item.registerDate = `${year}-${month}-${day}`;
    }

    let rankName = "";
    switch (item.priorityCode) {
      case "f005":
        rankName = "반려";
        break;
      case "f004":
        rankName = "심사중";
        break;
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
        rankName = "미정";
        break;
    }
    item.priorityCode = rankName;

    // 계획서, 결과서 버튼 활성화
    if (userRole === "USER") {
      // 1. 일반 이용자: 관리자가 승인(g001)한 계획서가 1개라도 있을 때만 활성화!
      item.hasPlan = item.planCount > 0;
      // 결과서도 마찬가지로 승인된 것만 보이게 하려면 item.finishCount > 0 사용
      item.hasResult = item.finishCount > 0;
    } else {
      // 2. 기관 관리자/담당자: 계획서가 존재하기만 하면(작성중 포함) 활성화!
      item.hasPlan = item.hasPlanCount > 0;
      item.hasResult = item.hasResultCount > 0;
    }

    return item;
  });
};

// 일반이용자
// const findByUser = async (id, page, limit) => {
//   // 1. Mapper에서 { data: [...], totalCount: 숫자 } 형태의 객체를 받아옴!
//   let result = await mainMapper.selectByUser(id, page, limit);

//   // 2. 알맹이(result.data)만 쏙 빼서 랭크명, 버튼 활성화 등의 가공을 거침
//   let formattedData = formatListData(result.data, "USER");

//   // 3. 프론트로 쏴주기 위해 다시 원래 형태 { data, totalCount }로 묶어서 반환!
//   return {
//     data: formattedData,
//     totalCount: result.totalCount,
//   };
// };
//일반 이용자 검색조건 추가 고동현
const findByUser = async (id, page, limit, searchOption = {}) => {
  let result = await mainMapper.selectByUser(id, page, limit, searchOption);

  let formattedData = formatListData(result.data, "USER");

  return {
    data: formattedData,
    totalCount: result.totalCount,
  };
};

// 기관담당자
// const findByManager = async (id, page, limit) => {
//   let result = await mainMapper.selectByManager(id, page, limit);
//   let formattedData = formatListData(result.data, "MANAGER");

//   return {
//     data: formattedData,
//     totalCount: result.totalCount,
//   };
// };

//기관담당자 사이드바 검색조건 추가 고동현
const findByManager = async (id, page, limit, searchOption = {}) => {
  let result = await mainMapper.selectByManager(id, page, limit, searchOption);
  let formattedData = formatListData(result.data, "MANAGER");

  return {
    data: formattedData,
    totalCount: result.totalCount,
  };
};

// 기관관리자
// const findByGeneral = async (id, page, limit) => {
//   let result = await mainMapper.selectByGeneral(id, page, limit);
//   let formattedData = formatListData(result.data, "GENERAL");

//   return {
//     data: formattedData,
//     totalCount: result.totalCount,
//   };
// };

//기관관리자 사이드바 검색조건 추가
const findByGeneral = async (id, page, limit, searchOption = {}) => {
  let result = await mainMapper.selectByGeneral(id, page, limit, searchOption);
  let formattedData = formatListData(result.data, "GENERAL");

  return {
    data: formattedData,
    totalCount: result.totalCount,
  };
};

const findManagersByInstitution = async (institutionId) => {
  return await mainMapper.selectManagersByInstitution(institutionId);
};

module.exports = {
  findByUser,
  findByManager,
  findByGeneral,
  findManagersByInstitution,
};
