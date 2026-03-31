// src/database/mappers/approval_result_mapper.js
const { pool } = require("../DAO.js");
const sqls = require("../sql/approval_result_sql.js");

// 1. 대기 목록 조회
const getPendingResultList = async (instiId, filters, limit, offset) => {
  let conn = await pool.getConnection();
  try {
    let sql = sqls.selectPendingResultList;
    const params = [instiId];

    // 상세 검색 필터링
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

    sql += ` ORDER BY pr.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    return await conn.query(sql, params);
  } finally {
    if (conn) conn.release();
  }
};

// 2. 승인
const approveResultPlan = async (resultReportId, adminId) => {
  let conn = await pool.getConnection();
  try {
    return await conn.query(sqls.updateResultApprove, [
      adminId,
      resultReportId,
    ]);
  } finally {
    if (conn) conn.release();
  }
};

// 3. 반려
const rejectResultPlan = async (resultReportId, adminId, rejectReason) => {
  let conn = await pool.getConnection();
  try {
    return await conn.query(sqls.updateResultReject, [
      adminId,
      rejectReason,
      resultReportId,
    ]);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { getPendingResultList, approveResultPlan, rejectResultPlan };
