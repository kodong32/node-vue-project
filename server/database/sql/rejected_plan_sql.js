// src/database/sql/rejected_plan_sql.js

const selectRejectedBase = `
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
    p.reject_reason,   /* 💡 핵심: 반려 사유 */
    p.wirte_at,        /* 🚨 오타 그대로 유지 */
    sv.result AS priorityCode, 
    sp.name AS supportName, 
    sp.born AS birthDate, 
    sp.gender AS genderCode, 
    dm.description AS disabilityType, /* 💡 별칭 완벽 적용 */
    gu.name AS guardianName, 
    iu.name AS managerName 
  FROM Plan_Tbl p
  JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
  JOIN Support_Tbl sp ON sv.support_id = sp.support_id
  JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
  /* 💡 어제 맞춘 대로, 계획서를 '작성한' 담당자 기준! */
  LEFT JOIN InstiUser_Tbl iu ON p.I_UserId1 = iu.I_UserId
  LEFT JOIN DisMajor_Tbl dm ON sp.major = dm.b_Code
  WHERE p.state = 'g002' /* 🚨 반려 건만 조회! */
`;

// 1. 기관 담당자용 (자기가 작성했는데 반려당한 건)
const selectRejectedByManager = selectRejectedBase + ` AND p.I_UserId1 = ? `;

// 2. 기관 관리자용 (우리 기관에서 반려된 전체 건)
const selectRejectedByGeneral =
  selectRejectedBase + ` AND iu.institution_id = ? `;

module.exports = {
  selectRejectedByManager,
  selectRejectedByGeneral,
};
