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

//지원대상자 PK 생성용 마지막 row PK조회
const getLastSupportId = async () => {
  let conn = null
  try{
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(userSql.lastSupportId);
    console.log(rows);
    return rows;
  }
  catch(err) {
    console.log(err);
  }
  finally{
    conn.release();
  }
};


const supportAdd = async (supportInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(userSql.supportAddSql, supportInfo);
    console.log(result);
    return result;

  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

module.exports = {
  testSelect, supportAdd,getLastSupportId
};
