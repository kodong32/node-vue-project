//조사서 관련 mapper
const { pool } = require("../DAO");
const surveySql = require("../sql/survey_sql");

//조사지 조회페이지!!!!!!!!!!!!!!!!!
//조사지 전체조회 <김민지, 디비에 있는 데이터 가져와서 전체조회 26.03.23 추가>
const selectSurveyAll = async () => {
  let conn = null;
  conn = await pool.getConnection();
  try {
    let rows = await conn.query(surveySql.selectSurveyAll);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//조사지 건별조회 <김민지, 디비에 있는 데이터 가져와서 건별조회 26.03.23 추가>
const selectSurveyById = async (J_ID) => {
  let conn = null;
  conn = await pool.getConnection();
  try {
    let rows = await conn.query(surveySql.selectSurveyById, J_ID);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// //조사지 답변 조회 <김민지 26.03.24 추가>
// const surveySelectAnswer = async (data) => {
//   let conn = null;
//   try {
//     conn = await pool.getConnection();
//     let rows = await conn.query(surveySql.surveySelectAnswer, data);
//     console.log(rows);
//     return rows;
//   } catch (err) {
//     console.log(err);
//   } finally {
//     if (conn) conn.release();
//   }
// };

//조사지 등록페이지!!!!!!!!!!!!!!!!!
//조사지 등록 <김민지 26.03.23 추가> 👉등록1번
const insertSurvey = async (surveyInfo) => {
  let conn = null; //아직 커넥션 안빌려왔으니 초기값을 null로 설정;
  try {
    conn = await pool.getConnection(); //커넥션 풀에서 사용 가능한 커넥션을 하나 가져옴(이미 만들어진 걸 재사용)
    let rows = await conn.query(surveySql.insertSurvey, surveyInfo);
    //surveySql에서 등록 쿼리 가져오고, 파라미터에서 등록할 값을 전달
    return rows; //rows 값을 리턴해서 돌려줌
  } catch (err) {
    console.log("DB 에러:", err); //콘솔에 에러 표시
    throw err;
  } finally {
    if (conn) conn.release(); //커넥션 반환
  }
};

//일반이용자 조사지 등록 pk 생성용 마지막 row pk조회(김민지 26.03.24 추가) 👉등록2번
const getLastJID = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.lastJId);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

//조사지 답변 등록 <김민지 26.03.24 추가>
const insertSurveyAnswer = async (answerData) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(surveySql.insertSurveyAnswer, answerData);
    return result;
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

//조사지 마지막 답변 (pk 생성용) 마지막 row pk조회(김민지 26.03.24 추가)
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

//조사지 문항에 대한 답변 <김민지, 26.03.24 추가>
const selectItemsByJID = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.surveySelectItem, [id]); // MySQL2 기준
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//일반이용자가 추가한 지원대상자 정보 <김민지, 260326>
const SupportById = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(surveySql.SupportById, id);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  selectSurveyAll,
  selectSurveyById,
  selectItemsByJID,
  insertSurvey,
  getLastJID,
  lastAnswer,
  insertSurveyAnswer,
  SupportById,
};
