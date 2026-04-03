//지원계획서 관련 mapper
const { pool } = require("../DAO");
const planSql = require("../sql/plan_sql");

//마지막 PK 조회
const getLastPlanId = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(planSql.getLastPlanId);
    return rows[0];
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//insert
const insertPlan = async (param) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(planSql.insertPlan, param);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//조사지 불러오기
const getSurveyListByInstUser = async (I_UserId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(planSql.getSurveyListByInstUser, [
      I_UserId,
      I_UserId,
    ]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//suplist
const getSupportListByInstUser = async (
  I_UserId,
  managerName,
  guardianName,
  supportName,
  surveyId,
) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(planSql.getSupportListByInstUser, [
      I_UserId,
      I_UserId,
      I_UserId,
      I_UserId,
      managerName,
      managerName,
      guardianName,
      guardianName,
      supportName,
      supportName,
      surveyId,
      surveyId,
    ]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const deletePlan = async (supportPlan_Id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(planSql.deletePlan, supportPlan_Id);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
module.exports = {
  getLastPlanId,
  insertPlan,
  getSurveyListByInstUser,
  getSupportListByInstUser,
  deletePlan,
};
