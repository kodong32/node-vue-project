// src/services/result_plan_service.js
const mapper = require("../database/mappers/result_plan_mapper.js");

// 1. 조회
const fetchApprovedPlansForModal = async (managerId, filters, page, limit) => {
  const offset = (page - 1) * limit;
  const rawList = await mapper.getApprovedPlans(
    managerId,
    filters,
    limit,
    offset,
  );

  const formattedList = rawList.map((item) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    return {
      ...item,
      support_startDate: formatDate(item.support_startDate),
      supprot_endDate: formatDate(item.supprot_endDate),
      wirte_at: formatDate(item.wirte_at),
    };
  });

  return { data: formattedList, totalCount: formattedList.length };
};

// 2. 등록
const savePlanResult = async (data) => {
  // 💡 실무에서는 여기서 result_report ID를 자동 생성하는 로직을 넣습니다.
  // (예: uuid를 쓰거나 DB에서 마지막 번호를 조회해서 생성)
  // 지금은 프론트에서 넘어온 시간을 조합해서 임시 ID를 만들어볼게.
  data.result_report = `REST${Date.now().toString().slice(-4)}`;

  await mapper.createPlanResult(data);
  return { success: true, id: data.result_report };
};

module.exports = { fetchApprovedPlansForModal, savePlanResult };
