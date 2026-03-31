// src/services/approval_result_service.js
const mapper = require("../database/mappers/approval_result_mapper.js");

// 조회
const fetchPendingResultList = async (instiId, filters, page, limit) => {
  const offset = (page - 1) * limit;
  const rawList = await mapper.getPendingResultList(
    instiId,
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
      created_at: formatDate(item.created_at), // 결과서 작성일
      stateName: "검토중",
    };
  });

  return { data: formattedList, totalCount: formattedList.length };
};

// 승인 처리
const handleApprove = async (resultReportId, adminId) => {
  if (!resultReportId) throw new Error("결과서 ID가 없습니다.");
  return await mapper.approveResultPlan(resultReportId, adminId);
};

// 반려 처리
const handleReject = async (resultReportId, adminId, rejectReason) => {
  if (!resultReportId) throw new Error("결과서 ID가 없습니다.");
  if (!rejectReason) throw new Error("반려 사유를 입력해야 합니다.");
  return await mapper.rejectResultPlan(resultReportId, adminId, rejectReason);
};

module.exports = { fetchPendingResultList, handleApprove, handleReject };
