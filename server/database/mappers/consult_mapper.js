//상담기록 관련 mapper
const { pool } = require("../DAO");
const consultSql = require("../sql/consult_sql");

//전체조회
const consultList = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.consultList);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//폼 장애유형 대 선택
const description = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.description);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//폼 장애유형 중 선택
const descriptionMiddle = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.descriptionMiddle);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//폼 상담장소 선택
const placeList = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.placeList);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//폼 상담방법 선택
const methodList = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.methodList);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//폼 담당자 정/부
const manager = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.manager);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//상담기록 등록
const consultAdd = async (info) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.consultAdd, [
      info.counsult_id,
      info.J_ID,
      info.I_UserId,
      info.support_id,
      info.counsult_date,
      info.write_date,
      info.counsult_loc,
      info.counsult_startTime,
      info.counsult_endTime,
      info.counsult_content,
      info.updated_at,
      info.counsult_method,
      info.counsult_content2,
      info.counsult_content3,
      info.counsult_content4,
    ]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//상담기록 등록 시 counsult_id 마지막 row를 기준으로 pk 생성
const counsultId = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.counsultId);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//상담기록 리스트 페이징 카운트
const consultCount = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.consultCount);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//건별조회
const consultDetail = async (j_Code) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(consultSql.consultDetail, [j_Code]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  consultList,
  description,
  placeList,
  methodList,
  manager,
  consultAdd,
  counsultId,
  consultCount,
  consultDetail,
  descriptionMiddle,
};
