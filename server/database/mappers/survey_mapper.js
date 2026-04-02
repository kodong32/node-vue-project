//조사서 관련 mapper
const { pool } = require("../DAO");
const surveySql = require("../sql/survey_sql");

//사이드바-남/여 공통코드
const gender = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.gender);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//지원대상자 리스트
const support = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.support);
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
    let rows = await conn.query(surveySql.description);
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
    let rows = await conn.query(surveySql.descriptionMiddle);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//조사지 등록
const serveyAdd = async (info) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.serveyAdd, [
      info.J_ID,
      info.Ver_Id,
      info.G_UserId,
      info.support_id,
      info.result,
      info.reason,
      info.created_at,
      info.updated_at,
    ]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//조사지 등록 시 J_ID 마지막 row를 기준으로 pk 생성
const surveyJId = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.surveyJId);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//등록시 답변 데이터
const answerAdd = async (info) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.answerAdd, info);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//조사지 답변 마지막 row를 기준으로 pk 생성
const lastAnswer = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.lastAnswer);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//문항 가져오기
const items = async (Ver_Id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.items, Ver_Id);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//상세조회
const surveyDetail = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.surveyDetail, [id]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//타이틀 코드
const title = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.title);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//조사지 답변 조회
const answerSelect = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.answerSelect, [id]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  gender,
  support,
  description,
  descriptionMiddle,
  serveyAdd,
  surveyJId,
  answerAdd,
  lastAnswer,
  items,
  surveyDetail,
  title,
  answerSelect,
};
