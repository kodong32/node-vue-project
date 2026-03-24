// main_sql.js
// 메인페이지 관련 sql문
// userId로 조회
const selectByUserId = `
SELECT gu.name as generalName,
      iu.name as instiName,
      su.name as supportName,
      DATE_FORMAT(sv.created_at, '%y-%m-%d') as registerDate,
      sv.result as priorityCode,
      sv.J_ID as surveyId,
      pl.J_ID as planId,
      pr.result_report as resultId
FROM GeneralUser_Tbl gu
INNER JOIN InstiUser_Tbl iu
ON gu.institution_id = iu.institution_id
INNER JOIN Support_Tbl su
ON gu.G_UserId = su.G_UserId
INNER JOIN Survey_Tbl sv
ON gu.G_UserId = sv.G_UserId
LEFT JOIN Plan_Tbl pl
ON su.support_id = sv.support_id
AND sv.J_ID = pl.J_ID
LEFT JOIN PlanResult_Tbl pr
ON su.support_id = sv.support_id
AND sv.J_ID = pl.J_ID
AND pl.supportPlan_id = pr.supportPlan_id
WHERE gu.G_UserId = ? AND iu.roll IN ('a003');
`;

module.exports = {
  selectByUserId,
};
