// src/database/sql/result_plan_sql.js

// 💡 1. 결과서 작성을 위한 '승인된 계획서' 목록 조회
const selectApprovedPlansForModal = `
  SELECT 
    p.supportPlan_id, 
    p.J_ID, 
    p.support_startDate, 
    p.supprot_endDate, 
    p.purpose, 
    p.content, 
    p.wirte_at, 
    sp.name AS supportName, 
    sp.born AS birthDate, 
    sp.gender AS genderCode, 
    
    /* 🌟 [수정] 콤마로 묶인 장애유형 쪼개서 합치기! */
    (
      SELECT GROUP_CONCAT(dm.description SEPARATOR ', ') 
      FROM DisMajor_Tbl dm 
      WHERE FIND_IN_SET(dm.b_Code, sp.major) > 0
    ) AS disabilityType,
    
    gu.name AS guardianName, 
    iu.name AS managerName 
  FROM Plan_Tbl p
  JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
  JOIN Support_Tbl sp ON sv.support_id = sp.support_id
  JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
  LEFT JOIN InstiUser_Tbl iu ON p.I_UserId1 = iu.I_UserId
  /* 🚨 LEFT JOIN DisMajor_Tbl 삭제 완료 */
  WHERE p.state = 'g001' 
    AND p.I_UserId1 = ?  
    
    /* 🌟 핵심 해결: 현재 승인완료(g001) 또는 대기중(g003)인 결과서가 존재하는 계획서는 제외! (반려(g002)된 건 다시 노출) */
    AND p.supportPlan_id NOT IN (
      SELECT supportPlan_id FROM PlanResult_Tbl WHERE state IN ('g001', 'g003')
    )
`;

// 💡 2. 결과서 저장 (INSERT) - 상태는 'g003'(검토대기), 승인자(I_UserId2)는 우선 NULL
const insertPlanResult = `
  INSERT INTO PlanResult_Tbl (
    result_report, supportPlan_id, I_UserId, result, content, file1, file2, created_at, state
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, NOW(), 'g003'
  )
`;

// 가장 큰 ID(마지막 번호) 조회
const selectMaxResultId = `
  SELECT MAX(result_report) AS maxId FROM PlanResult_Tbl
`;

// 일반 조회 (담당자/관리자 공용)
const selectGeneralResultList = `
  SELECT 
    pr.result_report,
    pr.supportPlan_id,
    pr.result AS resultTitle,
    pr.content AS resultContent,
    pr.file1,
    pr.file2,
    pr.created_at,
    pr.state,
    pr.reject_reason,
    p.purpose AS planPurpose,
    p.content AS planContent,
    p.support_startDate,
    p.supprot_endDate,
    sp.name AS supportName,
    sp.born AS birthDate,
    sp.gender AS genderCode,
    
    /* 🌟 [수정] 콤마로 묶인 장애유형 쪼개서 합치기! */
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
  /* 🚨 LEFT JOIN DisMajor_Tbl 삭제 완료 */
  WHERE iu.institution_id = ?
`;

// 반려된 결과서 목록 조회
const selectRejectedResultList = `
  SELECT 
    pr.result_report,
    pr.supportPlan_id,
    pr.result AS resultTitle,
    pr.content AS resultContent,
    pr.file1,
    pr.file2,
    pr.created_at,
    pr.state,
    pr.reject_reason,
    p.purpose AS planPurpose,
    p.content AS planContent,
    p.support_startDate,
    p.supprot_endDate,
    sp.name AS supportName,
    sp.born AS birthDate,
    sp.gender AS genderCode,
    
    /* 🌟 [수정] 콤마로 묶인 장애유형 쪼개서 합치기! */
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
  /* 🚨 LEFT JOIN DisMajor_Tbl 삭제 완료 */
  WHERE pr.state = 'g002' /* 🚨 반려된 상태만! */
    AND iu.institution_id = ?
`;

module.exports = {
  selectApprovedPlansForModal,
  insertPlanResult,
  selectMaxResultId,
  selectGeneralResultList,
  selectRejectedResultList,
};
