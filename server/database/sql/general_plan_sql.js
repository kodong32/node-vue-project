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
    p.wirte_at,        /* 🚨 DB 오타(write -> wirte) 그대로 반영 */
    sv.result as priorityCode, 
    sp.name as supportName, 
    sp.born as birthDate, 
    sp.gender as genderCode, 
    
    /* 🌟 [수정됨] 콤마로 묶인 장애유형 쪼개서 합치기! */
    (
      SELECT GROUP_CONCAT(dm.description SEPARATOR ', ') 
      FROM DisMajor_Tbl dm 
      WHERE FIND_IN_SET(dm.b_Code, sp.major) > 0
    ) as disabilityType,
    
    gu.name as guardianName, 
    iu.name as managerName 
FROM Plan_Tbl p
JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
JOIN Support_Tbl sp ON sv.support_id = sp.support_id
JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
LEFT JOIN InstiUser_Tbl iu ON p.I_UserId1 = iu.I_UserId
/* 🚨 쓸모없어진 LEFT JOIN DisMajor_Tbl 은 삭제 완료! */
WHERE iu.institution_id = ? 
`;

module.exports = {
  selectGeneralPlanListBase,
};
