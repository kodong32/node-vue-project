// 사용자(일반이용자, 기관담당자, 기관관리자, 시스템관리자) 관련 sql
const testSelect = `SELECT * FROM GeneralUser_Tbl`;

// 일반이용자 회원가입 sql문<김경환, 일반이용자 회원가입 쿼리문>
const insertUser = `
INSERT INTO GeneralUser_TBL (name, id, password, tel, email, zipCode, address, document1, document2)
VALUES(?,?,?,?,?,?,?,?,?) `;

module.exports = {
  testSelect,
  insertUser,
};
