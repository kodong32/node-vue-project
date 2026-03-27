//조사지 관련 sql문

//조회페이지
//조사지 전체조회 <김민지, 조사지 전체조회 쿼리 작성>
const selectSurveyAll = `
SELECT J_ID,
       Ver_Id,
       G_UserId,
       support_id,
       result,
       reason,
       created_at,
       updated_at
FROM Survey_Tbl
ORDER BY J_ID`;

//조사지 건별조회 <김민지, 조사지 건별조회 쿼리 작성> <김민지, 쿼리 0326수정>
const selectSurveyById = `
SELECT 
    s.J_ID,
    s.Ver_Id,
    s.G_UserId,
    s.support_id,
    s.result,
    s.reason,
    s.created_at,
    q.question_id,
    q.titleCode,
    q.question_no,
    q.question_text,
    q.answer_type,
    a.answer_id,
    a.answer
FROM Survey_Tbl s
JOIN SurveyItem_Tbl q
ON   s.Ver_Id = q.Ver_Id
LEFT JOIN SurveyAnswer_Tbl a 
     ON q.question_id = a.question_id
     AND s.J_ID = a.J_ID
WHERE s.J_ID = ?
ORDER BY q.question_no;
`;

// //조사지 답변 조회 <김민지, 260326 추가>
// const surveySelectAnswer = `
// SELECT answer_id,
//        J_ID,
//        question_id,
//        answer
// FROM SurveyUserAnswer_Tbl;
// ORDER BY answer_id`;

//등록페이지
//조사지 등록 <김민지, 조사지 등록 쿼리 작성>
const insertSurvey = `
INSERT INTO Survey_Tbl (
       J_ID,
       Ver_Id,
       G_UserId,
       support_id,
       result,
       reason,
       created_at,
       updated_at
)
VALUES (
?,  -- J_ID
       (SELECT Ver_Id 
        FROM SurveyForm_Tbl 
        WHERE use_yn = 'Y' 
        ORDER BY created_at DESC 
        LIMIT 1),
       ?, ?, ?, ?, ?, ?)`;

// SurveyUserAnswer_Tbl에 답변 등록 <김민지, 조사지 답변 쿼리 26.03.24 추가>
const insertSurveyAnswer = `
INSERT INTO SurveyUserAnswer_Tbl (
  answer_id,
  J_ID,
  question_id,
  answer
) VALUES (?, ?, ?, ?)`;

// 조사지 문항 조회 쿼리 <김민지, 2026.03.24>
const surveySelectItem = `
SELECT
  question_id,
  Ver_Id,
  titleCode,
  question_no,
  question_text,
  answer_type
FROM SurveyItem_Tbl
WHERE Ver_Id = (
    SELECT Ver_Id
    FROM SurveyForm_Tbl
    WHERE is_active = 'Y'
    LIMIT 1
)
ORDER BY question_no
`;

//일반이용자 조사지 등록 마지막 pk조회 sql문 (김민지 26.03.24 추가)
const lastJId = ` 
SELECT J_ID
FROM Survey_Tbl
ORDER BY J_ID DESC
LIMIT 1`;

const lastAnswer = `
SELECT answer_id
FROM SurveyUserAnswer_Tbl
ORDER BY answer_id DESC
LIMIT 1`;

//일반이용자가 추가한 지원대상자 정보 <김민지, 260326>
const SupportById = `
SELECT 
    support_id,
    name,
    major,
    middle,
    sub,
    gender,
    born
FROM Support_Tbl 
WHERE G_UserId = ?;
`;

module.exports = {
  selectSurveyAll,
  selectSurveyById,
  insertSurvey,
  insertSurveyAnswer,
  surveySelectItem,
  lastJId,
  lastAnswer,
  SupportById,
};
