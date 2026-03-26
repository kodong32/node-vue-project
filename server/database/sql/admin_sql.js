const lastFormId = `
SELECT Ver_Id
FROM SurveyForm_Tbl
ORDER BY Ver_Id DESC
LIMIT 1
`;


const lastItemId = `
SELECT question_id
FROM SurveyItem_Tbl
ORDER BY question_id DESC
LIMIT 1
`;


const SurveyFormInsert =
`
INSERT INTO SurveyForm_Tbl(Ver_Id, Sys_Id, version, description, created_at )
VALUES(?, ?, ?, ?, ?)
`;

const SurveyItemInsert =
`
INSERT INTO SurveyItem_Tbl(question_id, Ver_Id, titleCode, question_no, question_text, answer_type)
VALUES(?, ?, ?, ?, ?, ?)
`;


const adminLoginSql = 
`
SELECT Sys_Id, id, password, roll
FROM SysAdmin_Tbl
WHERE id = ?
`;

const getSurveyVersionList =
`
SELECT Ver_Id, version, description, created_at, use_yn
FROM SurveyForm_Tbl
ORDER BY created_at DESC, Ver_Id DESC
`;


const useYtoNSql = 
`
UPDATE SurveyForm_Tbl
SET use_yn = 'N'
WHERE use_yn = 'Y'
`;

const useVersionSql =
`
UPDATE SurveyForm_Tbl
SET use_yn = 'Y'
WHERE Ver_Id = ?
`;

module.exports = {
  lastFormId,
  lastItemId,
  SurveyFormInsert,
  SurveyItemInsert,
  adminLoginSql,
  getSurveyVersionList,
  useYtoNSql,
  useVersionSql 
};