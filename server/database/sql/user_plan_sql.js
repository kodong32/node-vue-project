// src/database/sql/user_plan_sql.js

// 💡 일반 이용자용 철통 보안 쿼리! (상태 g001 고정, 내 것만 조회)
const selectUserPlanList = `
  SELECT 
    p.*, 
    iu.name AS managerName, 
    gu.name AS guardianName, 
    sp.name AS supportName,
    dm.description AS disabilityType
  FROM Plan_Tbl p
  JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
  JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
  JOIN Support_Tbl sp ON sv.support_id = sp.support_id
  /* 💡 sp.I_UserId1 에서 p.I_UserId1 으로 변경! (계획서 작성자 기준) */
  LEFT JOIN InstiUser_Tbl iu ON p.I_UserId1 = iu.I_UserId 
  LEFT JOIN DisMajor_Tbl dm ON sp.major = dm.b_Code
  WHERE gu.G_UserId = ? 
    AND p.state = 'g001'
`;

module.exports = {
  selectUserPlanList,
};
