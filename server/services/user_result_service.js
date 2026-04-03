// src/services/user_result_service.js

const mapper = require("../database/mappers/user_result_mapper.js");

const fetchUserResultList = async (filters) => {
  try {
    const rawList = await mapper.getUserResultDetail(filters);

    // 🌟 기관 측 서비스와 완벽하게 동일한 포맷팅(날짜, 상태 변환) 적용!
    const formattedList = rawList.map((item) => {
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      };

      // 상태 코드 한글 매핑
      const stateMap = { g001: "승인 완료", g002: "반려", g003: "승인요청중" };

      return {
        ...item,
        support_startDate: formatDate(item.support_startDate),
        supprot_endDate: formatDate(item.supprot_endDate),
        created_at: formatDate(item.created_at),
        stateName: stateMap[item.state] || "대기",
      };
    });

    return {
      data: formattedList,
      totalCount: formattedList.length,
    };
  } catch (error) {
    console.error(`[일반이용자] 지원결과서 서비스 에러: ${error}`);
    throw error;
  }
};

module.exports = { fetchUserResultList };
