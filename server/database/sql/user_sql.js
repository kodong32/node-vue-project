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

//일반이용자 정보조회
const getUserInfo = `
SELECT
  g.G_UserId AS GUSERID,
  g.id,
  g.name,
  g.tel,
  g.email,
  g.address,
  i.institution_name AS institution,
  i.institution_id
FROM GeneralUser_Tbl g
LEFT JOIN Institution_Tbl i
  ON g.institution_id = i.institution_id
WHERE g.id = ?
`;

//일반이용자 정보 업데이트
const updateUserInfo = `
UPDATE GeneralUser_Tbl
SET
  institution_id = ?,
  name = ?,
  id = ?,
  tel = ?,
  email = ?,
  zipCode = ?,
  address = ?,
  document1 = ?,
  document2 = ?
WHERE G_UserId = ?
`;


const getUserPasswordByGUserId = `
SELECT G_UserId, password
FROM GeneralUser_Tbl
WHERE G_UserId = ?
`;

const updatePassword = `
UPDATE GeneralUser_Tbl
SET password = ?
WHERE G_UserId = ?
`;


//기관검색
const searchInstitutions =
`
SELECT
  institution_id,
  institution_name,
  zipCode,
  address,
  tel,
  email
FROM Institution_Tbl
WHERE state = 'b001'
  AND (? = '' OR address LIKE CONCAT('%', ?, '%'))
  AND (? = '' OR address LIKE CONCAT('%', ?, '%'))
  AND (? = '' OR institution_name LIKE CONCAT('%', ?, '%'))
ORDER BY institution_name ASC
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
`;

const confirmInstiUser = `
SELECT I_UserId ,institution_id ,name, id, password, tel, roll
FROM InstiUser_Tbl
WHERE id = ?
`;

//일반회원 아이디 중복 확인용(김경환 2026.03.26)
const userIdCheck = `
SELECT COUNT(*) AS cnt
FROM GeneralUser_Tbl
WHERE id = ?
`;

//기관 직원 아이디 중복 확인용(김경환 2026.03.27)
const instiIdCheck = `
SELECT COUNT(*) AS cnt
FROM InstiUser_Tbl
WHERE id = ?
`;

//기관 담당자 조회(김경환 20260331)
const getManagerList = `
SELECT *
FROM InstiUser_Tbl
WHERE roll = 'a003'
`;

//유저 승인 및 대기 조회(김경환 20260331)
const waitUser = `
SELECT * 
FROM GeneralUser_Tbl
WHERE approval = 'g002'
AND institution_id = ?
`;

const agreeUser = `
UPDATE GeneralUser_Tbl
SET approval = 'g001'
WHERE G_UserId = ?
`;


//기관 담당자 마이페이지
const getInstInfo =
`
SELECT
  iu.I_UserId,
  iu.id,
  iu.name,
  iu.tel,
  iu.institution_id,
  it.institution_name AS institution
FROM InstiUser_Tbl iu
LEFT JOIN Institution_Tbl it
  ON iu.institution_id = it.institution_id
WHERE iu.I_UserId = ?
`;

const getSupporterList =
`
SELECT
  s.support_id,
  s.G_UserId,
  s.I_UserId1,
  s.I_UserId2,
  s.name AS support_name,
  s.born,
  s.gender,
  s.relation,
  s.zipCode AS support_zipCode,
  s.address AS support_address,
  s.major,
  s.middle,
  s.sub,

  g.name AS guardian_name,
  g.id AS guardian_id,
  g.tel AS guardian_tel,
  g.email AS guardian_email,
  g.zipCode AS guardian_zipCode,
  g.address AS guardian_address,
  g.institution_id AS guardian_institution_id,
  g.approval AS guardian_approval,

  CASE
    WHEN s.I_UserId1 = ? THEN '정담당'
    WHEN s.I_UserId2 = ? THEN '부담당'
    ELSE ''
  END AS chargeType

FROM InstiUser_Tbl i
LEFT JOIN Support_Tbl s
  ON i.I_UserId = s.I_UserId1
  OR i.I_UserId = s.I_UserId2
LEFT JOIN GeneralUser_Tbl g
  ON s.G_UserId = g.G_UserId
WHERE i.I_UserId = ?
  AND s.support_id IS NOT NULL
ORDER BY s.name ASC;
`;


//기관 담당자 비밀번호 변경
const getInstiUserPassword = `
SELECT I_UserId, password
FROM InstiUser_Tbl
WHERE I_UserId = ?
`;

const updateInstiUserPassword = `
UPDATE InstiUser_Tbl
SET password = ?
WHERE I_UserId = ?
`;

//기관 담당자 정보수정
const updateInstiUserInfo = `
UPDATE InstiUser_Tbl
SET name = ?,
    tel = ?
WHERE I_UserId = ?
`;


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
  userIdCheck,
  instiIdCheck,
  getUserInfo,
  // userIdCheck,
  getManagerList,
  waitUser,
  agreeUser,
  updateUserInfo,
  getUserPasswordByGUserId,
  updatePassword,
  searchInstitutions,
  getInstInfo,
  getSupporterList,
  getInstiUserPassword,
  updateInstiUserPassword,
  updateInstiUserInfo,
};
