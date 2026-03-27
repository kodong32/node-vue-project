// priority_mapper.js 우선순위 요청
const { pool } = require("../DAO.js");
const prioritySql = require("../sql/priority_sql.js");

const getSupportInfo = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(prioritySql.selectSupportInfo, [id]);
    return rows;
  } catch (err) {
    console.error(`지원자 정보 에러: ${err}`);
  } finally {
    if (conn) conn.release();
  }
};

const generateApprovalId = async (conn) => {
  const rows = await conn.query(prioritySql.selectLastApprovalId);
  if (rows.length === 0) return "APPR0000";

  const lastId = rows[0].approval_Id; // ex: 'APPR0012'
  const numPart = parseInt(lastId.substring(4), 10);
  const nextNum = numPart + 1;
  return `APPR${String(nextNum).padStart(4, "0")}`; // 'APPR0013'
};

const requestPriorityApproval = async (surveyId, priorityCode, reason) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // 트랜잭션 시작! (오류 나면 다 롤백)

    // 1. 새 결재 번호 따기
    const newApprovalId = await generateApprovalId(conn);

    // 2. 결재 대기 테이블에 INSERT
    await conn.query(prioritySql.insertApprovalWait, [
      newApprovalId,
      surveyId,
      priorityCode,
      reason,
    ]);

    // 3. 조사지 상태를 'f004(심사중)'으로 UPDATE
    await conn.query(prioritySql.updateSurveyStatus, [surveyId]);

    await conn.commit(); // 모든 게 성공하면 도장 쾅!
    return true;
  } catch (err) {
    if (conn) await conn.rollback(); // 에러 나면 물리기!
    console.error(`승인 요청 저장 에러: ${err}`);
    return false;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getSupportInfo,
  requestPriorityApproval,
};
