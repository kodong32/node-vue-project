// src/database/mappers/user_plan_mapper.js

const { pool } = require("../DAO.js");
const userPlanSql = require("../sql/user_plan_sql.js"); // 💡 분리한 SQL 불러오기!

const getUserPlanList = async (filters, limit, offset) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    let sql = userPlanSql.selectUserPlanList;
    const params = [filters.userId]; // 🔒 1중 자물쇠: 로그인한 유저 본인!

    // 메인에서 특정 조사지 클릭해서 넘어왔을 때 조건 추가
    if (filters.surveyId) {
      sql += ` AND p.J_ID = ?`;
      params.push(filters.surveyId);
    }

    // 최신순 정렬 및 페이징
    sql += ` ORDER BY p.wirte_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const rows = await conn.query(sql, params);
    return rows;
  } catch (err) {
    console.error(`[일반이용자] 지원계획서 매퍼 에러: ${err}`);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getUserPlanList,
};
