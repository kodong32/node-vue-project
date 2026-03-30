// src/database/sql/general_plan_sql.js

const selectGeneralPlanListBase = `
SELECT 
    p.supportPlan_id, 
    p.J_ID, 
    p.support_startDate, 
    p.supprot_endDate, /* DB 오타 그대로 반영 */
    p.purpose, 
    p.content, 
    p.file, 
    p.file2,           /* 💡 두 번째 첨부파일 추가! */
    p.state, 
    p.reject_reason,   /* 💡 반려 사유 추가! */
    p.wirte_at,        /* 🚨 DB 오타(write -> wirte) 그대로 반영 (매우 중요!) */
    sv.result as priorityCode, 
    sp.name as supportName, 
    sp.born as birthDate, 
    sp.gender as genderCode, 
    dm.description as disabilityType,
    gu.name as guardianName, 
    iu.name as managerName 
FROM Plan_Tbl p
JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
JOIN Support_Tbl sp ON sv.support_id = sp.support_id
JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
LEFT JOIN InstiUser_Tbl iu ON p.I_UserId1 = iu.I_UserId
LEFT JOIN DisMajor_Tbl dm ON sp.major = dm.b_Code
/* 기관 관리자 전용: 소속된 기관의 담당자들이 쓴 계획서만 조회 */
WHERE iu.institution_id = ? 
`;

module.exports = {
  selectGeneralPlanListBase,
};
