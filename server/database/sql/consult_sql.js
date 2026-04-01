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

//폼 상담장소 선택
const placeList = `
  SELECT DISTINCT counsult_loc 
  FROM ConsultRecord_Tbl 
  WHERE counsult_loc IS NOT NULL 
  ORDER BY counsult_loc;
`;

//폼 상담방법 선택
const methodList = `
SELECT DISTINCT counsult_method
FROM ConsultRecord_Tbl
WHERE counsult_method IS NOT NULL 
ORDER BY counsult_method
`;

//폼 담당자 정+부 데이터
const manager = `
SELECT I_UserId, 
       name 
FROM InstiUser_Tbl 
WHERE roll = 'a003'
`;

//상담기록 등록
const consultAdd = `
INSERT INTO ConsultRecord_Tbl (
    counsult_id,
    J_ID,
    I_UserId,
    support_id,
    counsult_date,
    write_date,
    counsult_loc,
    counsult_startTime,
    counsult_endTime,
    counsult_content,
    updated_at,
    counsult_method,
    counsult_content2,
    counsult_content3,
    counsult_content4)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

//상담기록 등록 시 counsult_id 마지막 row를 기준으로 pk 생성
const counsultId = ` 
SELECT counsult_id
FROM ConsultRecord_Tbl
ORDER BY counsult_id DESC
LIMIT 1`;

//상담기록 리스트 페이징 카운트
const consultCount = `
SELECT COUNT(*) AS total
FROM ConsultRecord_Tbl
`;

module.exports = {
  consultList,
  description,
  placeList,
  methodList,
  manager,
  consultAdd,
  counsultId,
  consultCount,
};
