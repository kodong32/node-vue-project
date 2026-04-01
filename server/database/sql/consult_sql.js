//상담기록 관련 sql문

//전체조회
const consultList = `
SELECT
  c.counsult_id,
  c.J_ID,
  c.I_UserId,
  c.support_id,
  s.name AS support_name,
  g.G_UserID,
  g.name AS user_name,
  c.counsult_date,
  c.write_date,
  c.counsult_loc,
  c.counsult_startTime,
  c.counsult_endTime,
  c.counsult_content,
  c.updated_at,
  c.counsult_method,
  i.name
FROM ConsultRecord_Tbl c
LEFT JOIN Support_Tbl s ON c.support_id = s.support_id
LEFT JOIN GeneralUser_Tbl g ON g.G_UserID = s.G_UserID
LEFT JOIN InstiUser_Tbl i ON i.I_UserId = c.I_UserId
ORDER BY c.counsult_id desc;
`;

//폼 장애유형 선택
const description = `
SELECT b_Code AS code, description
FROM DisMajor_Tbl
ORDER BY description;`;

module.exports = { consultList, description };
