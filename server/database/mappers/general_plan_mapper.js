// src/database/mappers/general_plan_mapper.js (새 파일 생성!)

const { pool } = require("../DAO.js");
const generalPlanSql = require("../sql/general_plan_sql.js");

const getGeneralPlanList = async (filters, limit, offset) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    let sql = generalPlanSql.selectGeneralPlanListBase;

    // 💡 1. 쿼리의 첫 번째 '?'에 들어갈 기관 ID 무조건 삽입!
    const params = [filters.instiId];

    // 💡 2. 모달창 상세 검색 조건 (입력된 값만 동적으로 AND 붙이기)
    if (filters.managerName) {
      sql += ` AND iu.name LIKE ?`;
      params.push(`%${filters.managerName}%`);
    }
    if (filters.guardianName) {
      sql += ` AND gu.name LIKE ?`;
      params.push(`%${filters.guardianName}%`);
    }
    if (filters.supportName) {
      sql += ` AND sp.name LIKE ?`;
      params.push(`%${filters.supportName}%`);
    }
    if (filters.surveyId) {
      sql += ` AND p.J_ID = ?`;
      params.push(filters.surveyId); // 정확한 일치 검색이므로 LIKE 대신 = 사용
    }

    // 💡 3. 최신순 정렬 및 무한 스크롤
    sql += ` ORDER BY p.wirte_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const rows = await conn.query(sql, params);
    return rows;
  } catch (err) {
    console.error(`[기관관리자] 지원계획서 목록 조회 에러: ${err}`);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getGeneralPlanList,
};
