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
    dm.description AS disabilityType,
    gu.name AS guardianName, 
    iu.name AS managerName 
  FROM Plan_Tbl p
  JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
  JOIN Support_Tbl sp ON sv.support_id = sp.support_id
  JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
  LEFT JOIN InstiUser_Tbl iu ON p.I_UserId1 = iu.I_UserId
  LEFT JOIN DisMajor_Tbl dm ON sp.major = dm.b_Code
  WHERE p.state = 'g001' /* 🚨 무조건 승인된 계획서만! */
    AND p.I_UserId1 = ?  /* 💡 로그인한 담당자 본인 것만! */
    /* 🌟 핵심 센스: 이미 결과서(PlanResult_Tbl)가 있는 계획서는 목록에서 제외! */
    AND NOT EXISTS (
      SELECT 1 FROM PlanResult_Tbl pr WHERE pr.supportPlan_id = p.supportPlan_id
    )
`;

// 💡 2. 결과서 저장 (INSERT) - 상태는 'g003'(검토대기), 승인자(I_UserId2)는 우선 NULL
const insertPlanResult = `
  INSERT INTO PlanResult_Tbl (
    result_report, supportPlan_id, I_UserId1, result, content, file1, file2, created_at, state
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, NOW(), 'g003'
  )
`;

module.exports = {
  selectApprovedPlansForModal,
  insertPlanResult,
};
