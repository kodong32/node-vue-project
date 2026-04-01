//상담기록 관련 mapper
const { pool } = require("../DAO");
const consultSql = require("../sql/consult_sql");

//전체조회
const consultList = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.consultList);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

const description = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.description);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { consultList, description };
