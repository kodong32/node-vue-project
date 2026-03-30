// src/services/user_plan_service.js

const userPlanMapper = require("../database/mappers/user_plan_mapper.js");

// 💡 날것의 DB 데이터를 프론트 입맛에 맞게 가공해 주는 포장 공장!
const formatPlanData = (list) => {
  if (!list || list.length === 0) return [];

  return list.map((item) => {
    // 1. 날짜 깔끔하게 자르기 (YYYY-MM-DD)
    // (🚨 주의: DB 컬럼명이 wirte_at 으로 되어 있어서 그대로 썼어!)
    if (item.wirte_at) {
      const date = new Date(item.wirte_at);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      item.wirte_at = `${year}-${month}-${day}`;
    }

    if (item.support_startDate) {
      const date = new Date(item.support_startDate);
      item.support_startDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }

    if (item.supprot_endDate) {
      // 이것도 supprot 오타 그대로 맞춤!
      const date = new Date(item.supprot_endDate);
      item.supprot_endDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }

    // 2. 상태 코드 변환 (일반 유저는 어차피 'g001'만 넘어오겠지만, 확실하게 글자로 변환!)
    if (item.state === "g001") {
      item.stateName = "승인완료";
    }

    return item;
  });
};

const fetchUserPlanList = async (filters, page, limit) => {
  // DB의 LIMIT, OFFSET을 위한 계산
  const offset = (page - 1) * limit;

  // 1. 매퍼한테 "DB에서 데이터 좀 캐와!" 시키기
  const result = await userPlanMapper.getUserPlanList(filters, limit, offset);

  // 2. 캐온 데이터를 예쁘게 포장하기
  const formattedData = formatPlanData(result);

  // 3. 프론트엔드가 원래 받던 규격({ data: 배열, totalCount: 숫자 })대로 만들어서 리턴!
  return {
    data: formattedData,
    totalCount: formattedData.length, // 페이징용 전체 개수 (일단 배열 길이로, 나중에 count 쿼리 추가 가능)
  };
};

module.exports = {
  fetchUserPlanList,
};
