// src/database/sql/user_plan_sql.js

// 일반 이용자 지원계획서 조회
const selectUserPlanList = `
  SELECT 
    p.*, 
    iu.name AS managerName, 
    gu.name AS guardianName, 
    sp.name AS supportName,
    
    /* 🌟 [수정] 콤마로 묶인 장애유형 쪼개서 합치기! */
    (
      SELECT GROUP_CONCAT(dm.description SEPARATOR ', ') 
      FROM DisMajor_Tbl dm 
      WHERE FIND_IN_SET(dm.b_Code, sp.major) > 0
    ) AS disabilityType
    
  FROM Plan_Tbl p
  JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
  JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
  JOIN Support_Tbl sp ON sv.support_id = sp.support_id
  /* 💡 sp.I_UserId1 에서 p.I_UserId1 으로 변경! (계획서 작성자 기준) */
  LEFT JOIN InstiUser_Tbl iu ON p.I_UserId1 = iu.I_UserId 
  /* 🚨 LEFT JOIN DisMajor_Tbl 은 삭제했습니다! */
  WHERE gu.G_UserId = ? 
    AND p.state = 'g001'
`;

module.exports = {
  selectUserPlanList,
};
