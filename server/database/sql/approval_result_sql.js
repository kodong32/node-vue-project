// src/database/sql/approval_result_sql.js

// 1. 검토 중인 지원결과서 목록 조회 (관리자 소속 기관 기준)
const selectPendingResultList = `
  SELECT 
    pr.result_report,
    pr.supportPlan_id,
    pr.result AS resultTitle,    /* 결과서 제목 */
    pr.content AS resultContent, /* 결과서 내용 */
    pr.file1,
    pr.file2,
    pr.created_at,
    pr.state,
    p.purpose AS planPurpose,    /* 원본 계획서 목표 */
    p.content AS planContent,    /* 원본 계획서 내용 */
    p.support_startDate,
    p.supprot_endDate,
    sp.name AS supportName,
    sp.born AS birthDate,
    sp.gender AS genderCode,
    
    (
      SELECT GROUP_CONCAT(dm.description SEPARATOR ', ') 
      FROM DisMajor_Tbl dm 
      WHERE FIND_IN_SET(dm.b_Code, sp.major) > 0
    ) AS disabilityType,
    
    gu.name AS guardianName,
    iu.name AS managerName
  FROM PlanResult_Tbl pr
  JOIN Plan_Tbl p ON pr.supportPlan_id = p.supportPlan_id
  JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
  JOIN Support_Tbl sp ON sv.support_id = sp.support_id
  JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
  LEFT JOIN InstiUser_Tbl iu ON pr.I_UserId = iu.I_UserId
  /* 🚨 LEFT JOIN DisMajor_Tbl 은 삭제했습니다! */
  WHERE pr.state = 'g003' /* 🚨 검토 대기 중인 결과서만! */
    AND iu.institution_id = ?
`;

// 2. 결과서 승인 처리 (g001 변경 및 승인자 도장 쾅!)
const updateResultApprove = `
  UPDATE PlanResult_Tbl 
  SET state = 'g001', I_UserId2 = ? 
  WHERE result_report = ?
`;

// 3. 결과서 반려 처리 (g002 변경, 사유 추가, 반려자 도장 쾅!)
const updateResultReject = `
  UPDATE PlanResult_Tbl 
  SET state = 'g002', I_UserId2 = ?, reject_reason = ?
  WHERE result_report = ?
`;

module.exports = {
  selectPendingResultList,
  updateResultApprove,
  updateResultReject,
};
