// src/database/mappers/approval_plan_mapper.js
const { pool } = require("../DAO.js");
const sqls = require("../sql/approval_plan_sql.js");

// 1. 대기 목록 조회
const getPendingList = async (instiId, filters, limit, offset) => {
  let conn = await pool.getConnection();
  try {
    let sql = sqls.selectPendingList;
    const params = [instiId];

    // 상세 검색
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

    sql += ` ORDER BY p.wirte_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    return await conn.query(sql, params);
  } finally {
    if (conn) conn.release();
  }
};

// 승인
const approvePlan = async (supportPlanId, adminId) => {
  let conn = await pool.getConnection();
  try {
    const result = await conn.query(sqls.updatePlanApprove, [
      adminId,
      supportPlanId,
    ]);
    return result;
  } finally {
    if (conn) conn.release();
  }
};

// 반려
const rejectPlan = async (supportPlanId, adminId, rejectReason) => {
  let conn = await pool.getConnection();
  try {
    const result = await conn.query(sqls.updatePlanReject, [
      adminId,
      rejectReason,
      supportPlanId,
    ]);
    return result;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { getPendingList, approvePlan, rejectPlan };
