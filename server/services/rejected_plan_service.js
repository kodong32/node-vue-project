// src/services/rejected_plan_service.js
const mapper = require("../database/mappers/rejected_plan_mapper.js");

const fetchRejectedList = async (role, id, filters, page, limit) => {
  const offset = (page - 1) * limit;
  const rawList = await mapper.getRejectedList(
    role,
    id,
    filters,
    limit,
    offset,
  );

  const formattedList = rawList.map((item) => {
    // 날짜 가공 함수 (YYYY-MM-DD)
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    return {
      ...item,
      support_startDate: formatDate(item.support_startDate),
      supprot_endDate: formatDate(item.supprot_endDate),
      wirte_at: formatDate(item.wirte_at), // 프론트에서 반려일로 사용 가능
    };
  });

  return {
    data: formattedList,
    totalCount: formattedList.length,
  };
};

module.exports = { fetchRejectedList };
