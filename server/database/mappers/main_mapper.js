// main_mapper.js
// 메인페이지 관련 mapper
const { pool } = require("../DAO.js");
const mainSql = require("../sql/main_sql.js");

// 일반이용자
const selectByUser = async (id, page = 1, limit = 10) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const offset = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    let data = await conn.query(mainSql.selectByUser, [id, limitNum, offset]);
    let countResult = await conn.query(mainSql.countByUser, [id]);
    let totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

    return { data, totalCount };
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
};

// 기관담당자
const selectByManager = async (id, page = 1, limit = 10) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    const offset = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    let data = await conn.query(mainSql.selectByManager, [
      id,
      limitNum,
      offset,
    ]);
    let countResult = await conn.query(mainSql.countByManager, [id]);
    let totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

    return { data, totalCount };
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
};

// 기관관리자
const selectByGeneral = async (id, page = 1, limit = 10) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    const offset = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    let data = await conn.query(mainSql.selectByGeneral, [
      id,
      limitNum,
      offset,
    ]);
    let countResult = await conn.query(mainSql.countByGeneral, [id]);
    let totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

    return { data, totalCount };
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  selectByUser,
  selectByManager,
  selectByGeneral,
};
