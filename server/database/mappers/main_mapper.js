// 메인페이지 관련 mapper
const { pool } = require("../DAO.js");
const mainSql = require("../sql/main_sql.js");

const selectById = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows] = await conn.query(mainSql.selectById, id);
    return rows;
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  selectById,
};
