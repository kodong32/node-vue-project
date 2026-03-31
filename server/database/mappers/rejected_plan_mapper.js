// src/database/mappers/rejected_plan_mapper.js
const { pool } = require("../DAO.js");
const sqls = require("../sql/rejected_plan_sql.js");

const getRejectedList = async (role, id, filters, limit, offset) => {
  let conn = await pool.getConnection();
  try {
    // 권한에 따라 SQL 분기 (MANAGER vs GENERAL)
    let sql =
      role === "MANAGER"
        ? sqls.selectRejectedByManager
        : sqls.selectRejectedByGeneral;
    const params = [id];

    // 상세 검색 필터
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

    // 최신 반려일(수정일) 기준 정렬
    sql += ` ORDER BY p.wirte_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    return await conn.query(sql, params);
  } catch (err) {
    console.error(`[반려내역] 매퍼 에러: ${err}`);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { getRejectedList };
