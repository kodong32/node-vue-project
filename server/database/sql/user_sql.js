// 사용자(일반이용자, 기관담당자, 기관관리자, 시스템관리자) 관련 sql
const testSelect = `SELECT * FROM GeneralUser_Tbl`;


//지원대상자마지막PK조회 Query
const lastSupportId = 
`
SELECT support_id
FROM Support_Tbl
ORDER BY support_id DESC
LIMIT 1
`;

//**일반이용자 마이페이지 Query
//***일반이용자 지원대상자 등록 Query
const supportAddSql = 
`
INSERT INTO Support_Tbl(support_id, G_UserId, I_userId1, I_userId2, name, born, gender, relation, zipCode, address, major, middle,sub)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
`;


module.exports = {
  testSelect, supportAddSql,lastSupportId
};
