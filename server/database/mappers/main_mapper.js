// main_mapper.js
// 메인페이지 관련 mapper
const { pool } = require("../DAO.js");
const mainSql = require("../sql/main_sql.js");

// 일반이용자
// const selectByUser = async (id, page = 1, limit = 5) => {
//   let conn = null;
//   try {
//     conn = await pool.getConnection();
//     const offset = (Number(page) - 1) * Number(limit);
//     const limitNum = Number(limit);

//     let data = await conn.query(mainSql.selectByUser, [id, limitNum, offset]);
//     let countResult = await conn.query(mainSql.countByUser, [id]);
//     let totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

//     return { data, totalCount };
//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (conn) conn.release();
//   }
// };
//일반 이용자 검색 조건 추가 고동현
const selectByUser = async (id, page = 1, limit = 5, searchOption = {}) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    const offset = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    const writeDate = searchOption.writeDate || "";
    const applicantName = searchOption.applicantName || "";
    const managerName = searchOption.managerName || "";

    let data = await conn.query(mainSql.selectByUser, [
      id,
      writeDate, writeDate,
      managerName, managerName,
      applicantName, applicantName,
      limitNum,
      offset,
    ]);

    let countResult = await conn.query(mainSql.countByUser, [
      id,
      writeDate, writeDate,
      managerName, managerName,
      applicantName, applicantName,
    ]);

    let totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

    return { data, totalCount };
  } catch (err) {
    console.error(err);
    return { data: [], totalCount: 0 };
  } finally {
    if (conn) conn.release();
  }
};

// 기관담당자
// const selectByManager = async (id, page = 1, limit = 5) => {
//   let conn = null;
//   try {
//     conn = await pool.getConnection();

//     const offset = (Number(page) - 1) * Number(limit);
//     const limitNum = Number(limit);

//     let data = await conn.query(mainSql.selectByManager, [
//       id,
//       limitNum,
//       offset,
//     ]);
//     let countResult = await conn.query(mainSql.countByManager, [id]);
//     let totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

//     return { data, totalCount };
//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (conn) conn.release();
//   }
// };
//기관 담당자 사이드바 검색조건 추가 고동현
// 기관담당자
const selectByManager = async (id, page = 1, limit = 5, searchOption = {}) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    const offset = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    const writeDate = searchOption.writeDate || "";
    const applicantName = searchOption.applicantName || "";
    const managerName = searchOption.managerName || "";

    let data = await conn.query(mainSql.selectByManager, [
      id,
      writeDate, writeDate,
      applicantName, applicantName,
      managerName, managerName,
      limitNum,
      offset,
    ]);

    let countResult = await conn.query(mainSql.countByManager, [
      id,
      writeDate, writeDate,
      applicantName, applicantName,
      managerName, managerName,
    ]);

    let totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

    return { data, totalCount };
  } catch (err) {
    console.error(err);
    return { data: [], totalCount: 0 };
  } finally {
    if (conn) conn.release();
  }
};

// 기관관리자
// const selectByGeneral = async (id, page = 1, limit = 5) => {
//   let conn = null;
//   try {
//     conn = await pool.getConnection();

//     const offset = (Number(page) - 1) * Number(limit);
//     const limitNum = Number(limit);

//     let data = await conn.query(mainSql.selectByGeneral, [
//       id,
//       limitNum,
//       offset,
//     ]);
//     let countResult = await conn.query(mainSql.countByGeneral, [id]);
//     let totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

//     return { data, totalCount };
//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (conn) conn.release();
//   }
// };

//기관관리자 사이드바 검색조건 추가
const selectByGeneral = async (id, page = 1, limit = 5, searchOption = {}) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    const offset = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    const writeDate = searchOption.writeDate || "";
    const applicantName = searchOption.applicantName || "";
    const managerId = searchOption.managerId || "";
    const managerName = searchOption.managerName || "";

    let data = await conn.query(mainSql.selectByGeneral, [
      id,
      writeDate, writeDate,
      applicantName, applicantName,
      managerId, managerId,
      managerName, managerName,
      limitNum,
      offset,
    ]);

    let countResult = await conn.query(mainSql.countByGeneral, [
      id,
      writeDate, writeDate,
      applicantName, applicantName,
      managerId, managerId,
      managerName, managerName,
    ]);

    let totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

    return { data, totalCount };
  } catch (err) {
    console.error(err);
    return { data: [], totalCount: 0 };
  } finally {
    if (conn) conn.release();
  }
};

const selectManagersByInstitution = async (institutionId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(mainSql.selectManagersByInstitution, [
      institutionId,
    ]);
    return result;
  } catch (err) {
    console.error(err);
    return [];
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  selectByUser,
  selectByManager,
  selectByGeneral,
  selectManagersByInstitution,
};
