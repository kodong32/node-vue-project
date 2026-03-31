// src/database/mappers/result_plan_mapper.js
const { pool } = require("../DAO.js");
const sqls = require("../sql/result_plan_sql.js");

// 1. 모달용 목록 불러오기
const getApprovedPlans = async (managerId, filters, limit, offset) => {
  let conn = await pool.getConnection();
  try {
    let sql = sqls.selectApprovedPlansForModal;
    const params = [managerId];

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

    sql += ` ORDER BY p.wirte_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    return await conn.query(sql, params);
  } finally {
    if (conn) conn.release();
  }
};

// 2. 결과서 등록하기
const createPlanResult = async (data) => {
  let conn = await pool.getConnection();
  try {
    const params = [
      data.result_report, // 생성된 결과서 ID
      data.supportPlan_id, // 선택한 계획서 ID
      data.managerId, // 작성자 ID
      data.result, // 결과서 제목
      data.content, // 결과서 내용
      data.file1 || null,
      data.file2 || null,
    ];
    return await conn.query(sqls.insertPlanResult, params);
  } finally {
    if (conn) conn.release();
  }
};

const getMaxResultId = async () => {
  let conn = await pool.getConnection();
  try {
    return await conn.query(sqls.selectMaxResultId);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { getApprovedPlans, createPlanResult, getMaxResultId };
