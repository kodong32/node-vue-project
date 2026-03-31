// src/services/approval_plan_service.js
const mapper = require("../database/mappers/approval_plan_mapper.js");

// 조회
const fetchPendingList = async (instiId, filters, page, limit) => {
  const offset = (page - 1) * limit;
  const rawList = await mapper.getPendingList(instiId, filters, limit, offset);

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
      stateName: "검토중", // 무조건 대기 중인 데이터만 오니까 고정!
    };
  });

  return { data: formattedList, totalCount: formattedList.length };
};

// 승인 처리
const handleApprove = async (supportPlanId, adminId) => {
  if (!supportPlanId) throw new Error("계획서 ID가 없습니다.");
  return await mapper.approvePlan(supportPlanId, adminId);
};

// 반려 처리
const handleReject = async (supportPlanId, adminId, rejectReason) => {
  if (!supportPlanId) throw new Error("계획서 ID가 없습니다.");
  if (!rejectReason) throw new Error("반려 사유를 입력해야 합니다.");
  return await mapper.rejectPlan(supportPlanId, adminId, rejectReason);
};

module.exports = { fetchPendingList, handleApprove, handleReject };
