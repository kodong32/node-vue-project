// 메인페이지 관련 sql문
// userId로 조회
const selectById = `
SELECT gu.name as generalName, 
      iu.name as instiName,
      su.name as supportName,
      DATE_FORMAT(sv.created_at, '%y-%m-%d'),
      sv.result,
      pl.J_ID,
      pr.result_report
FROM GeneralUser_Tbl gu
INNER JOIN InstiUser_Tbl iu
ON gu.institution_id = iu.institution_id
INNER JOIN Support_Tbl su
ON gu.G_UserId = su.G_UserId
INNER JOIN Survey_Tbl sv
ON gu.G_UserId = sv.G_UserId
INNER JOIN Plan_Tbl pl
ON su.support_id = sv.support_id
AND sv.J_ID = pl.J_ID
INNER JOIN PlanResult_Tbl pr
ON su.support_id = sv.support_id
AND sv.J_ID = pl.J_ID
AND pl.supportPlan_id = pr.supportPlan_id
WHERE gu.G_UserId = ? AND iu.roll IN ('a003');
`;

module.exports = {
  selectById,
};
