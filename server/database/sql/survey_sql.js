//조사지 관련 sql문

//사이드바-남/여 공통코드
const gender = `
SELECT Code, codeName
FROM CommCode_Tbl
WHERE codeGroup = '성별구분코드';
`;

//지원대상자 리스트
const support = `
SELECT DISTINCT
  s.support_id,
  s.G_UserId,
  s.I_UserId1,
  s.I_UserId2,
  s.name,
  s.born,
  s.gender,
  s.relation,
  s.zipCode,
  s.address,
  s.major,
  s.middle,
  s.sub,
  g.name AS generalUser_name
FROM Support_Tbl s
LEFT JOIN GeneralUser_Tbl g ON s.G_UserId = g.G_UserId
`;

//getVersion
const getVersion =
`
SELECT
   Ver_Id, Sys_Id, version, description, created_at, use_yn
FROM SurveyForm_Tbl
WHERE use_yn = 'Y'
`;

//폼 장애유형 대 선택
const description = `
SELECT b_Code AS code, description
FROM DisMajor_Tbl
ORDER BY description;`;

//폼 장애유형 중 선택
const descriptionMiddle = `
SELECT j_Code, b_Code AS code, description
FROM DisMiddle_Tbl
ORDER BY description;`;

//조사지 등록
const serveyAdd = `
INSERT INTO Survey_Tbl(
  J_ID,
  Ver_Id,
  G_UserId,
  support_id,
  result,
  reason,
  created_at,
  updated_at
)
VALUES (?,?,?,?,?,?,?,?);
`;

//조사지 등록 시 J_ID 마지막 row를 기준으로 pk 생성
const surveyJId = ` 
SELECT J_ID
FROM Survey_Tbl
ORDER BY J_ID DESC
LIMIT 1`;

//등록시 답변 데이터
const answerAdd = `
INSERT INTO SurveyUserAnswer_Tbl (answer_id, J_ID, question_id, answer) 
VALUES (?, ?, ?, ?)`;

//조사지 답변 마지막 row를 기준으로 pk 생성
const lastAnswer = `
SELECT answer_id
FROM SurveyUserAnswer_Tbl
ORDER BY answer_id DESC
LIMIT 1`;

//시스템 관리자 문항 가져오기
const items = `
SELECT 
    i.question_id,
    i.question_text,
    i.answer_type,
    i.titleCode,
    f.use_yn,
    f.Ver_Id as Form_Ver_Id,
    t.title AS S_Name,
    t.parentCode
FROM SurveyItem_Tbl i
LEFT JOIN SurveyForm_Tbl f ON i.Ver_Id = f.Ver_Id
LEFT JOIN SurveyTitle_Tbl t ON i.titleCode = t.titleCode
WHERE i.Ver_Id = ?
ORDER BY i.question_id ASC;
`;

//상세조회
const surveyDetail = `
SELECT 
    m.J_ID, 
    m.G_UserId,
    u.name AS userName,
    m.created_at, 
    m.reason,
    q.question_id, 
    q.titleCode,
    q.question_no, 
    q.question_text, 
    q.answer_type,
    a.answer,
    s.support_id,
    s.name AS supportName,
    it.institution_name
FROM Survey_Tbl m
LEFT JOIN SurveyItem_Tbl q ON m.Ver_Id = q.Ver_Id
LEFT JOIN SurveyUserAnswer_Tbl a ON q.question_id = a.question_id AND a.J_ID = m.J_ID
LEFT JOIN GeneralUser_Tbl u ON m.G_UserId = u.G_UserId
LEFT JOIN Support_Tbl s ON m.support_id = s.support_id
LEFT JOIN Institution_Tbl it ON it.institution_id = u.institution_id
WHERE m.J_ID = ?
  AND (
    ? IS NOT NULL                     /* 1. 시스템 관리자 (isAdmin) */
    OR (it.institution_id = ?)        /* 2. 기관 관리자 (institutionId) */
    OR (s.I_UserId1 = ? OR s.I_UserId2 = ? OR m.G_UserId = ?) /* 3. 담당자 혹은 작성자 (userId) */
  )
ORDER BY q.titleCode, q.question_no ASC;
`;

//타이틀 코드
const title = `
SELECT 
  titleCode,
  title,
  parentCode,
  level
FROM SurveyTitle_Tbl
ORDER BY titleCode
`;

//조사지 답변 조회
const answerSelect = `
SELECT answer_id,
       J_ID,
       question_id,
       answer
FROM SurveyUserAnswer_Tbl
WHERE J_ID = ?
ORDER BY answer_id`;

module.exports = {
  gender,
  support,
  description,
  descriptionMiddle,
  serveyAdd,
  surveyJId,
  answerAdd,
  lastAnswer,
  items,
  surveyDetail,
  title,
  answerSelect,
  getVersion
};
