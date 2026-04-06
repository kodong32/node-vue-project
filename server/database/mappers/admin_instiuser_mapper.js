// D:\node-vue-project\server\database\mapper\admin_instiuser_mapper.js
const { pool } = require("../DAO.js");
const sql = require("../sql/admin_instiuser_sql.js");

/**
 * 1. 기관관리자 목록 조회 (검색 및 대기 토글)
 */
const getInstiUserList = async (name, isWaitOnly) => {
  // 🌟 role 파라미터 삭제
  let conn = null;
  try {
    conn = await pool.getConnection();
    // 🌟 SQL 물음표 3개에 맞춰 파라미터 3개 전달: [기관명, 기관명, 대기토글]
    const params = [name, name, String(isWaitOnly)];
    const rows = await conn.query(sql.selectInstiUserList, params);
    return rows;
  } catch (err) {
    console.error(`[시스템관리자] 기관관리자 목록 조회 매퍼 에러: ${err}`);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 2. 기관관리자 선택 승인 (대기 -> 승인)
 */
const approveInstiUsers = async (ids) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql.approveInstiUsers, [ids]);
    return result;
  } catch (err) {
    console.error(`[시스템관리자] 기관관리자 승인 매퍼 에러: ${err}`);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 3. 기관관리자 선택 삭제
 */
const deleteInstiUsers = async (ids) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql.deleteInstiUsers, [ids]);
    return result;
  } catch (err) {
    console.error(`[시스템관리자] 기관관리자 삭제 매퍼 에러: ${err}`);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const updateInstiUser = async (name, tel, userId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql.updateInstiUser, [name, tel, userId]);
    return result;
  } catch (err) {
    console.error(`[시스템관리자] 기관관리자 수정 매퍼 에러: ${err}`);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getInstiUserList,
  approveInstiUsers,
  deleteInstiUsers,
  updateInstiUser,
};
