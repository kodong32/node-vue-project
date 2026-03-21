//조사서 관련 mapper
const { pool } = require("../DAO");
const surveySql = require("../sql/survey_sql");

//조사지 전체조회 <김민지, 디비에 있는 데이터 가져와서 조회>
const selectSurveyAll = async () => {
  let conn = null;
  conn = await pool.getConnection();
  try {
    let [rows] = await conn.query(surveySql.selectSurveyAll);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { selectSurveyAll };
