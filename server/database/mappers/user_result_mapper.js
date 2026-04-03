// src/database/mappers/user_result_mapper.js (경로 확인 필요)

const { pool } = require("../DAO.js");
const userResultSql = require("../sql/user_result_sql.js");

// 인자를 userId, surveyId 따로 받지 않고, 팀 컨벤션처럼 filters 객체로 받습니다.
const getUserResultDetail = async (filters) => {
  let conn = null;
  try {
    // 🌟 1. DB 커넥션 가져오기
    conn = await pool.getConnection();

    // 🌟 2. 기본 쿼리 및 기본 파라미터 셋팅
    let sql = userResultSql.selectUserResultDetail;
    const params = [filters.userId]; // 🔒 1중 자물쇠: 로그인한 유저 본인

    // 🌟 3. 특정 조사지 클릭해서 넘어왔을 때 조건 동적 추가
    if (filters.surveyId) {
      sql += ` AND sv.J_ID = ?`; // SQL에서 Survey_Tbl을 sv로 별칭 지었다고 가정
      params.push(filters.surveyId);
    }

    // 🌟 4. 쿼리 실행
    const rows = await conn.query(sql, params);
    return rows;
  } catch (err) {
    console.error(`[일반이용자] 지원결과서 매퍼 에러: ${err}`);
    throw err;
  } finally {
    // 🌟 5. 커넥션 반환 (가장 중요!)
    if (conn) conn.release();
  }
};

module.exports = {
  getUserResultDetail,
};
