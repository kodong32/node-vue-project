// priority_service.js 우선순위 요청
const priorityMapper = require("../database/mappers/priority_mapper.js");

const fetchSupportInfo = async (id) => {
  const result = await priorityMapper.getSupportInfo(id);

  if (!result || result.length === 0) return null;

  let info = result[0];

  // 성별
  if (info.genderCode === "c001") info.genderCode = "남";
  else if (info.genderCode === "c002") info.genderCode = "여";
  else info.genderCode = "알수없음";

  // 날짜 포맷팅
  if (info.birthDate) {
    const date = new Date(info.birthDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    info.birthDate = `${year}. ${month}. ${day}.`;
  }

  return info;
};

const processPriorityRequest = async (surveyId, reqData) => {
  // 프론트에서 넘어온 data: { priority: 'f002', reason: '블라블라' }
  const { priority, reason } = reqData;

  // 성공 여부(true/false) 리턴
  const isSuccess = await priorityMapper.requestPriorityApproval(
    surveyId,
    priority,
    reason,
  );
  return isSuccess;
};

// 💡 정보 가져오기 서비스 (우선순위 코드를 한글로 변환)
const fetchApprovalWaitInfo = async (surveyId) => {
  const result = await priorityMapper.getApprovalWaitInfo(surveyId);
  if (!result || result.length === 0) return null;

  let info = result[0];
  // f001 -> 계획, f002 -> 중점 등 변환
  const priorityMap = { f001: "계획", f002: "중점", f003: "긴급" };
  info.priorityText = priorityMap[info.priorityCode] || "알수없음";

  return info;
};

// 💡 승인/반려 서비스 실행
const processDecidePriority = async (surveyId, data) => {
  const { action, reqPriorityCode, rejectReason } = data;
  return await priorityMapper.decidePriority(
    surveyId,
    action,
    reqPriorityCode,
    rejectReason,
  );
};

module.exports = {
  fetchSupportInfo,
  processPriorityRequest,
  fetchApprovalWaitInfo,
  processDecidePriority,
};
