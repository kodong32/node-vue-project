const { pool } = require("../DAO");
const disSql = require("../sql/disability_sql.js");


const getDisList = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(disSql.getDisList);
  
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};


const getMidList = async (bCodes) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    //?,?,?...개수에 맞게 생성하는 함수임
    const queryStrings = bCodes.map(()=> '?').join(',');


    let rows = await conn.query(disSql.getMidList(queryStrings),bCodes);

    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports = {
  getDisList, getMidList
};
