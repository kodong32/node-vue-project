// src/services/general_plan_service.js (새 파일 생성!)

const generalPlanMapper = require("../database/mappers/general_plan_mapper.js");

const fetchGeneralPlanList = async (filters, page, limit) => {
  const offset = (page - 1) * limit;

  // 관리자 전용 Mapper 호출!
  const rawList = await generalPlanMapper.getGeneralPlanList(
    filters,
    limit,
    offset,
  );

  const formattedList = rawList.map((item) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
    };

    const priorityMap = {
      f001: "계획",
      f002: "중점",
      f003: "긴급",
      f004: "심사중",
      f005: "반려",
    };
    const genderMap = { c001: "남", c002: "여" };

    return {
      ...item,
      support_startDate: formatDate(item.support_startDate),
      supprot_endDate: formatDate(item.supprot_endDate),
      priorityText: priorityMap[item.priorityCode] || "미정",
      genderText: genderMap[item.genderCode] || "알수없음",
      isRejected: item.state === "g002",
      isApproved: item.state === "g001",
    };
  });

  return formattedList;
};

module.exports = {
  fetchGeneralPlanList,
};
