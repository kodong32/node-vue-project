// priority_mapper.js 우선순위 요청
const { pool } = require("../DAO.js");
const prioritySql = require("../sql/priority_sql.js");

const getSupportInfo = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(prioritySql.selectSupportInfo, [id]);
    return rows;
  } catch (err) {
    console.error(`지원자 정보 에러: ${err}`);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getSupportInfo,
};
