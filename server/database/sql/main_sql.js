// 메인페이지 관련 sql문
const selectById = `
SELECT gu.name as 보호자, 
      iu.name as 담당자,
      su.name as 지원대상자,
      sv.created_at as 지원신청일,
      sv.result
FROM GeneralUser_Tbl gu
INNER JOIN InstiUser_Tbl iu
ON gu.institution_id = iu.institution_id
INNER JOIN Support_Tbl su
ON gu.G_UserId = su.G_UserId
INNER JOIN Survey_Tbl sv
ON gu.G_UserId = sv.G_UserId
WHERE gu.G_UserId = ? AND iu.roll IN ('a003');
`;

module.exports = {
  selectById,
};
