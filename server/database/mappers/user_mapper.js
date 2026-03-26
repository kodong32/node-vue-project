//사용자 관련 mapper
const { pool } = require("../DAO");
const userSql = require("../sql/user_sql");

const testSelect = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(userSql.testSelect);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//일반이용자 pk 생성용 마지막 row pk조회(김경환 2026.03.24 추가)
const getLastUserId = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(userSql.lastUserId);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

//일반이용자 회원가입<김경환, DB에 일반이용자의 회원정보를 등록>
const insertUser = async (userInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(userSql.insertUser, userInfo);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//기관이용자 pk 생성용 마지막 row pk조회(김경환 2026.03.24 추가)
const getLastInstiId = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(userSql.lastInstiId);
    console.log(rows);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

//기관이용자 회원가입<김경환, DB에 일반이용자의 회원정보를 등록>
const insertInstiUser = async (instiUserInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(userSql.insertInstiUser, instiUserInfo);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//지원대상자 PK 생성용 마지막 row PK조회
const getLastSupportId = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(userSql.lastSupportId);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const supportAdd = async (supportInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(userSql.supportAddSql, supportInfo);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const supUpdate = async (supId, supInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); //Auto Commit 해제
    let result = await conn.query(userSql.supUpdateSql, [supInfo, supId]);
    //추가 DML 실행 => 같은 트랜잭션으로 묶임
    conn.commit();
    return result;
  } catch (err) {
    console.log(err);
    conn.rollback();
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const supDel = async (supId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    let result = await conn.query(userSql.supDelSql, supId);
    conn.commit();
    return result;
  } catch (err) {
    console.log(err);
    conn.rollback();
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const supportList = async (supInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let result = await conn.query(userSql.supportList, supInfo);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//회원 로그인 확인(김경환 2026.03.25)
const confirmUser = async (id, password) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    console.log(id, password);
    let result = await conn.query(userSql.confirmUser, [id, password]);
    console.log(result[0]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//기관
const confirmInstiUser = async (id, password) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    console.log(id, password);
    let result = await conn.query(userSql.confirmInstiUser, [id, password]);
    console.log(result[0]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//아이디 중복 확인(김경환 2026.03.26)
// const userIdCheck = async (id) => {
//   let conn = null;
//   try {
//     conn = await pool.getConnection();
//     console.log(id);
//     let result = await conn.query(userSql.userIdCheck, id);
//     console.log(result);
//     return result;
//   } catch (err) {
//     conolse.log(err);
//   } finally {
//     if (conn) {
//       conn.release();
//     }
//   }
// };
module.exports = {
  testSelect,
  insertUser,
  insertInstiUser,
  supportAdd,
  getLastSupportId,
  getLastUserId,
  getLastInstiId,
  supportList,
  supUpdate,
  supDel,
  confirmUser,
  confirmInstiUser,
  // userUdCheck,
};
