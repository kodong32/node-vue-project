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

const getUserInfo = async (userId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(userSql.getUserInfo, userId);
    return rows[0];
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//일반이용자 정보수정
const updateUserInfo = async (params) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(userSql.updateUserInfo, params);

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

//일반이용자 비밀번호 변경 관련
const getUserPasswordByGUserId = async (userId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(userSql.getUserPasswordByGUserId, [userId]);
    return rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const updatePassword = async (params) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(userSql.updatePassword, params);

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

//기관검색
const searchInstitutions = async (params) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(userSql.searchInstitutions, params);
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
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
    // return result; //암호화 적용시 해당 주석 해제
    return result[0]; //평문화 비번용
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//일반회원 탈퇴
const withdrawUser = async (G_UserId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(userSql.withdrawUser, [G_UserId]);
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
const userIdCheck = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    console.log(id);
    let result = await conn.query(userSql.userIdCheck, [id]);
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

//기관 아이디 중복
const instiIdCheck = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    console.log(id);
    let result = await conn.query(userSql.instiIdCheck, [id]);
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

//기관담당자 조회(김경환 20260331)
const getManagerList = async (roll, institution_id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    let result = await conn.query(userSql.getManagerList, [
      roll,
      institution_id,
    ]);
    let info = result;
    return info;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//기관관리자의 이용자 회원가입 승인(김경환 20260331)
const waitUser = async (institution_id) => {
  let conn = await pool.getConnection();
  try {
    const rows = await conn.query(userSql.waitUser, [institution_id]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
  console.log(institution_id);
};

const agreeUser = async (id) => {
  let conn = await pool.getConnection();
  try {
    const result = await conn.query(userSql.agreeUser, [id]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//기관담당자 마이페이지
const getInstInfo = async (instId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(userSql.getInstInfo, instId);
    return rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const getSupporterList = async (instId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(userSql.getSupporterList, [
      instId,
      instId,
      instId,
    ]);
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

// 현재 비밀번호 확인용
const getInstiUserPassword = async (I_UserId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(userSql.getInstiUserPassword, [I_UserId]);
    return rows[0] || null;
  } catch (err) {
    console.log("getInstiUserPassword mapper error :", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

// 비밀번호 변경
const updateInstiUserPassword = async (newPassword, I_UserId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(userSql.updateInstiUserPassword, [
      newPassword,
      I_UserId,
    ]);
    return result;
  } catch (err) {
    console.log("updateInstiUserPassword mapper error :", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const updateInstiUserInfo = async (data) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    const result = await conn.query(userSql.updateInstiUserInfo, [
      data.name,
      data.tel,
      data.I_UserId,
    ]);

    return result;
  } catch (err) {
    console.log("updateInstiUserInfo mapper error :", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const getInstInfoById = async (iUserId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(userSql.getInstInfoById, iUserId);

    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const checkInstitutionAdmin = async (iUserId, InstId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(userSql.checkInstitutionAdmin, [
      iUserId,
      InstId,
    ]);

    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const updateInstInfo = async (updateInfo) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(userSql.updateInstInfo, updateInfo);
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

//기관 내 담당자 조회
const getManagerListByInstitution = async (instId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(userSql.getManagerListByInstitution, instId);

    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//경환
const getMangerMainSubList = async (instId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(userSql.getManagerListByInstitution, instId);
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//기관 내 담당자가 배정받은 지원대상자정보
const getAssignedSupportListByManager = async (iUserId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(userSql.getAssignedSupportListByManager, [
      iUserId,
      iUserId,
    ]);
    return rows;
  } catch (err) {
    console.log("getAssignedSupportListByManager mapper error :", err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//기관관리자의 담당자선택(김경환 20260401)
const updateManager = async (instiId1, instiId2, supportId) => {
  let conn = await pool.getConnection();
  try {
    const rows = await conn.query(userSql.updateManager, [
      instiId1,
      instiId2,
      supportId,
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

//기관관리자의 담당자회원가입승인(김경환 20260401)
const waitInstiUser = async (institution_id) => {
  let conn = await pool.getConnection();
  try {
    const rows = await conn.query(userSql.waitInstiUser, [institution_id]);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const agreeInstiUser = async (id) => {
  let conn = await pool.getConnection();
  try {
    const result = await conn.query(userSql.agreeInstiUser, [id]);
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

const getSupportInstitutionByJid = async (jid) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(userSql.getSupportInstitutionByJid, [jid]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

const rejectUser = async (id) => {
  let conn = await pool.getConnection();
  try {
    const result = await conn.query(userSql.rejectUser, [id]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const rejectInstUser = async (id) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(userSql.rejectInstUser, [id]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
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
  userIdCheck,
  instiIdCheck,
  getUserInfo,
  // userUdCheck,
  getManagerList,
  waitUser,
  agreeUser,
  updateUserInfo,
  getUserPasswordByGUserId,
  updatePassword,
  searchInstitutions,
  getInstInfo,
  getSupporterList,
  getInstiUserPassword,
  updateInstiUserPassword,
  updateInstiUserInfo,
  getInstInfoById,
  updateManager,
  waitInstiUser,
  agreeInstiUser,
  getSupportInstitutionByJid,
  checkInstitutionAdmin,
  updateInstInfo,
  getManagerListByInstitution,
  getAssignedSupportListByManager,
  withdrawUser,
  getMangerMainSubList,
  rejectUser,
  rejectInstUser,
};
