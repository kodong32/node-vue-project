// 사용자(일반이용자, 기관담당자, 기관관리자, 시스템관리자) 관련 sql
const testSelect = `SELECT * FROM GeneralUser_Tbl`;

//일반이용자 마지막 pk조회 sql문(김경환, 2026.03.24 추가)
const lastUserId = `
SELECT G_UserId
FROM GeneralUser_Tbl
ORDER BY G_UserId DESC
LIMIT 1
`;

// 일반이용자 회원가입 sql문<김경환, 일반이용자 회원가입 쿼리문>
const insertUser = `
INSERT INTO GeneralUser_Tbl (G_UserId, institution_id, name, id, password, tel, email, zipCode, address, document1, document2)
VALUES(?,?,?,?,?,?,?,?,?,?,?) `;

//기관이용자 마지막 pk조회 sql문(김경환, 2026.03.24 추가)
const lastInstiId = `
SELECT I_UserId
FROM InstiUser_Tbl
ORDER BY I_UserId DESC
LIMIT 1
`;

//기관이용자 회원가입 sql문<김경환, 기관이용자 회원가입 쿼리문>
const insertInstiUser = `
INSERT INTO InstiUser_Tbl (I_UserId ,institution_id ,name, id, password, tel, roll)
VALUES(?,?,?,?,?,?,?)`;

//지원대상자마지막PK조회 Query
const lastSupportId = `
SELECT support_id
FROM Support_Tbl
ORDER BY support_id DESC
LIMIT 1
`;

//**일반이용자 마이페이지 Query
//***일반이용자 지원대상자 등록 Query
const supportAddSql = `
INSERT INTO Support_Tbl(support_id, G_UserId, I_userId1, I_userId2, name, born, gender, relation, zipCode, address, major, middle,sub)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
`;

//일반이용자의 지원대상자 목록
const supportList = `
SELECT 
    support_id,
    G_UserId,
    I_UserId1,
    I_UserId2,
    name,
    born,
    gender,
    relation,
    zipCode,
    address,
    major,
    middle,
    sub
FROM Support_Tbl
WHERE G_userId = ?
`;

//지원대상자 정보 업데이트
const supUpdateSql = `
UPDATE Support_Tbl
SET ?
WHERE support_id = ?
`;

//지원대상자 삭제
const supDelSql = `
DELETE FROM Support_Tbl
WHERE support_id = ?
`;

//회원 로그인 확인(김경환 2026.03.25)
const confirmUser = `
SELECT G_UserId, institution_id, name, id, password, tel, email, zipCode, address, document1, document2
FROM GeneralUser_Tbl       
WHERE id = ?
AND password = ?
`;

const confirmInstiUser = `
SELECT I_UserId ,institution_id ,name, id, password, tel, roll
FROM InstiUser_Tbl
WHERE id = ?
AND password = ?`;

//일반회원 아이디 중복 확인용(김경환 2026.03.26)
// const userIdCheck = `
// SELECT G_UserId, institution_id, name, id, password, tel, email, zipCode, address, document1, document2
// FROM GeneralUser_Tbl
// WHERE id = ?
// `;
module.exports = {
  testSelect,
  insertUser,
  insertInstiUser,
  supportAddSql,
  lastSupportId,
  lastUserId,
  lastInstiId,
  supportList,
  supUpdateSql,
  supDelSql,
  confirmUser,
  confirmInstiUser,
  // userIdCheck,
};
