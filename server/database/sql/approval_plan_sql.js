// src/database/sql/approval_plan_sql.js

// 1. 검토 중인 계획서 목록 조회 (관리자 소속 기관 기준)
const selectPendingList = `
  SELECT 
    p.supportPlan_id, 
    p.J_ID, 
    p.support_startDate, 
    p.supprot_endDate, 
    p.purpose, 
    p.content, 
    p.file, 
    p.file2, 
    p.state, 
    p.wirte_at, 
    sv.result AS priorityCode, 
    sp.name AS supportName, 
    sp.born AS birthDate, 
    sp.gender AS genderCode, 
    dm.description AS disabilityType,
    gu.name AS guardianName, 
    iu.name AS managerName 
  FROM Plan_Tbl p
  JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
  JOIN Support_Tbl sp ON sv.support_id = sp.support_id
  JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
  LEFT JOIN InstiUser_Tbl iu ON p.I_UserId1 = iu.I_UserId
  LEFT JOIN DisMajor_Tbl dm ON sp.major = dm.b_Code
  WHERE p.state = 'g003'
    AND iu.institution_id = ?
`;

// 2. 승인 처리 (상태를 g001로 변경)
const updatePlanApprove = `
  UPDATE Plan_Tbl 
  SET state = 'g001', I_UserId2 = ? 
  WHERE supportPlan_id = ?
`;

// 3. 반려 처리 (상태를 g002로 변경하고 반려 사유 추가)
const updatePlanReject = `
  UPDATE Plan_Tbl 
  SET state = 'g002', I_UserId2 = ?, reject_reason = ?
  WHERE supportPlan_id = ?
`;

module.exports = {
  selectPendingList,
  updatePlanApprove,
  updatePlanReject,
};
