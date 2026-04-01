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
    a.answer
FROM Survey_Tbl m
INNER JOIN SurveyItem_Tbl q 
    ON m.Ver_Id = q.Ver_Id
LEFT JOIN GeneralUser_Tbl u
    ON m.G_UserId = u.G_UserId
LEFT JOIN SurveyUserAnswer_Tbl a 
    ON q.question_id = a.question_id 
    AND a.J_ID = m.J_ID
WHERE m.J_ID = ?
ORDER BY q.titleCode, q.question_no ASC
`;

//조사지 답변 조회 <김민지, 260326 추가>
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
  reason
) VALUES (?,
 (SELECT Ver_Id FROM SurveyForm_Tbl WHERE use_yn='Y' ORDER BY created_at DESC LIMIT 1),
  ?, ?, ?, ?);`;

// //일반유저
const user = `
INSERT INTO GeneralUser_Tbl (
  G_UserId,
  institution_id
  name
  id
  password
  tel
  email
  zipCode
  address
  document1
  document2
  approval
)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

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
    WHERE use_yn = 'Y'
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
    S.support_id, 
    S.name, 
    S.major, 
    S.middle, 
    M.description AS middle_category,
    S.sub, 
    S.gender, 
    S.born
FROM Support_Tbl S
LEFT JOIN DisMiddle_Tbl M 
    ON S.middle = M.j_Code
WHERE S.support_id = ?;
`;

//현재 활성화된 아이디만 가져오는 쿼리 <김민지, 26.03.27>
const getActiveVerId = `
  SELECT Ver_Id 
  FROM SurveyForm_Tbl 
  WHERE use_yn = 'Y' 
  ORDER BY created_at DESC 
  LIMIT 1
`;

//시스템 관리자가 업데이트한 문항 가져오기
const getQuestionsByJID = `
SELECT 
    question_id, 
    question_text, 
    titleCode, 
    question_no, 
    answer_type, 
    Ver_Id 
FROM SurveyItem_Tbl 
WHERE Ver_Id = ?
ORDER BY titleCode ASC, question_no ASC; 
`;

module.exports = {
  selectSurveyAll,
  selectSurveyById,
  insertSurvey,
  insertSurveyAnswer,
  surveySelectItem,
  lastJId,
  lastAnswer,
  getActiveVerId,
  SupportById,
  user,
  getQuestionsByJID,
};
