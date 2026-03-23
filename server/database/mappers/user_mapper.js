//사용자 관련 mapper
const { pool } = require("../DAO");
const userSql = require("../sql/user_sql");

const testSelect = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(userSql.testSelect);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//일반이용자 회원가입<김경환, DB에 일반이용자의 회원정보를 등록>
const insertUser = async (userInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(userSql.insertUsert, no);
    let info = result[0];
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports = {
  testSelect,
  insertUser,
};
