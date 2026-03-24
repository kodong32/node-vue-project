//조사지 관련 sql문

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

//조사지 건별조회 <김민지, 조사지 건별조회 쿼리 작성>
const selectSurveyById = `
SELECT J_ID,
       Ver_Id,
       G_UserId,
       support_id,
       result,
       reason,
       created_at,
       updated_at
FROM Survey_Tbl
WHERE J_ID = ?
`;

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
       updated_at)
VALUES(?, ?, ?, ?, ?, ?, ?, ?)
`;

//일반이용자 조사지 등록 마지막 pk조회 sql문 (김민지 26.03.24 추가)
const lastJId = ` 
SELECT J_ID
FROM Survey_Tbl
ORDER BY J_ID DESC
LIMIT 1
    `;

// SurveyUserAnswer_Tbl에 답변 등록 <김민지, 조사지 답변 쿼리 26.03.24 추가>
const insertSurveyAnswer = `
INSERT INTO SurveyUserAnswer_Tbl (
  answer_id,
  J_ID,
  question_id,
  answer
) VALUES (?, ?, ?, ?)
`;

//조사지 답변 <김민지, 조사지 답변 쿼리 26.03.24 추가>
const selectAnswer = `
SELECT
  answer_id,
  J_ID,
  question_id,
  answer
  FROM SurveyUserAnswer_Tbl
  ORDER BY answer_id
`;

module.exports = {
  selectSurveyAll,
  selectSurveyById,
  insertSurvey,
  lastJId,
  selectAnswer,
  insertSurveyAnswer,
};
