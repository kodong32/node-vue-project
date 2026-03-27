// priority_sql.js 우선순위 요청

// 지원자 정보
const selectSupportInfo = `
SELECT sp.name as supportName,
    gu.name as generalName,
    sp.born as birthDate,
    sp.gender as genderCode,
    dm.description as disMajorName,
    sv.result as currentStatus, /* 현재 상태 코드 (예: f005) */
    (
      SELECT result_reason 
      FROM ApprovalWait_Tbl 
      WHERE J_ID = sv.J_ID AND appr_result = 'g002' 
      ORDER BY approval_Id DESC LIMIT 1
    ) as rejectReason /* 가장 최근에 '반려(g002)'된 건의 사유만 쏙 빼오기 */
FROM Survey_Tbl sv
JOIN Support_Tbl sp ON sv.support_id = sp.support_id
JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
LEFT JOIN DisMajor_Tbl dm ON sp.major = dm.b_Code
WHERE sv.J_ID = ?;
`;

const insertApprovalWait = `
INSERT INTO ApprovalWait_Tbl (approval_Id, J_ID, appr_type, appr_reason) 
VALUES (?, ?, ?, ?);
`;

const updateSurveyStatus = `
UPDATE Survey_Tbl 
SET result = 'f004' 
WHERE J_ID = ?;
`;

const selectLastApprovalId = `
SELECT approval_Id FROM ApprovalWait_Tbl ORDER BY approval_Id DESC LIMIT 1;
`;

const selectApprovalWaitInfo = `
SELECT appr_type as priorityCode, appr_reason as reason
FROM ApprovalWait_Tbl
WHERE J_ID = ? AND (appr_result IS NULL OR appr_result = '')
ORDER BY approval_Id DESC LIMIT 1;
`;

// 💡 5. [승인] 처리 쿼리 (1: 대기테이블 승인 도장, 2: 조사지 상태 변경)
const updateApproveWait = `UPDATE ApprovalWait_Tbl SET appr_result = 'g001' WHERE J_ID = ? AND (appr_result IS NULL OR appr_result = '')`;
const updateSurveyPriority = `UPDATE Survey_Tbl SET result = ? WHERE J_ID = ?`;

// 💡 6. [반려] 처리 쿼리 (1: 대기테이블 반려 도장+사유, 2: 조사지 상태를 f005 반려로 변경)
const updateRejectWait = `UPDATE ApprovalWait_Tbl SET appr_result = 'g002', result_reason = ? WHERE J_ID = ? AND (appr_result IS NULL OR appr_result = '')`;
const updateSurveyToReject = `UPDATE Survey_Tbl SET result = 'f005' WHERE J_ID = ?`;

module.exports = {
  selectSupportInfo,
  insertApprovalWait,
  updateSurveyStatus,
  selectLastApprovalId,
  selectApprovalWaitInfo,
  updateApproveWait,
  updateSurveyPriority,
  updateRejectWait,
  updateSurveyToReject,
};
