// main_sql.js
// 메인페이지 관련 sql문
// 공통 쿼리 분리
const baseSelect = `
SELECT gu.name as generalName,
      iu.name as instiName,
      su.name as supportName,
      DATE_FORMAT(sv.created_at, '%y-%m-%d') as registerDate,
      sv.result as priorityCode,
      sv.J_ID as surveyId,
      (
        (SELECT COUNT(*) FROM Plan_Tbl p WHERE p.J_ID = sv.J_ID AND (p.state IS NULL OR p.state NOT IN ('g001', 'g002'))) + 
        (SELECT COUNT(*) FROM PlanResult_Tbl r INNER JOIN Plan_Tbl p ON r.supportPlan_id = p.supportPlan_id WHERE p.J_ID = sv.J_ID AND (r.state IS NULL OR r.state NOT IN ('g001', 'g002')))
      ) as reviewCount,
      (SELECT COUNT(*) FROM Plan_Tbl p WHERE p.J_ID = sv.J_ID AND p.state = 'g001') as planCount,
      (
        (SELECT COUNT(*) FROM Plan_Tbl p WHERE p.J_ID = sv.J_ID AND p.state = 'g002') + 
        (SELECT COUNT(*) FROM PlanResult_Tbl r INNER JOIN Plan_Tbl p ON r.supportPlan_id = p.supportPlan_id WHERE p.J_ID = sv.J_ID AND r.state = 'g002')
      ) as rejectCount,
      (SELECT COUNT(*) FROM PlanResult_Tbl r INNER JOIN Plan_Tbl p ON r.supportPlan_id = p.supportPlan_id WHERE p.J_ID = sv.J_ID AND r.state = 'g001') as finishCount,
      (SELECT COUNT(*) FROM Plan_Tbl p WHERE p.J_ID = sv.J_ID) as hasPlanCount,
      (SELECT COUNT(*) FROM PlanResult_Tbl r INNER JOIN Plan_Tbl p ON r.supportPlan_id = p.supportPlan_id WHERE p.J_ID = sv.J_ID) as hasResultCount
FROM GeneralUser_Tbl gu
INNER JOIN InstiUser_Tbl iu ON gu.institution_id = iu.institution_id
INNER JOIN Support_Tbl su ON gu.G_UserId = su.G_UserId
INNER JOIN Survey_Tbl sv ON gu.G_UserId = sv.G_UserId
`;

const selectByUser =
  baseSelect +
  `
WHERE gu.G_UserId = ? AND iu.roll IN ('a003')
ORDER BY sv.created_at DESC;
`;

const selectByManager =
  baseSelect +
  `
WHERE iu.I_UserId = ? AND iu.roll = 'a003' 
ORDER BY sv.created_at DESC;
`;

const selectByGeneral =
  baseSelect +
  `
WHERE gu.institution_id = ? AND iu.roll = 'a003'
ORDER BY sv.created_at DESC;
`;

module.exports = {
  selectByUser,
  selectByManager,
  selectByGeneral,
};
