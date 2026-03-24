// main_mapper.js
// 메인페이지 관련 mapper
const { pool } = require("../DAO.js");
const mainSql = require("../sql/main_sql.js");

// 일반이용자
const selectByUser = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(mainSql.selectByUser, [id]);
    return rows;
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
};

// 기관담당자
const selectByManager = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(mainSql.selectByManager, [id]);
    return rows;
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
};

// 기관관리자
const selectByGeneral = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(mainSql.selectByGeneral, [id]);
    return rows;
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
