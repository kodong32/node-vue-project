//admin mapper
const { pool } = require("../DAO");
const adminSql = require("../sql/admin_sql");


//SysAdmin Login
const adminLogin = async (adminId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(adminSql.adminLoginSql, [adminId]);
    return rows;

  } catch (err) {
    console.log(err);
    return {
      status: "Failed",
      message: err.message
    };
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
};


//조사지Form테이블 PK 생성용 마지막 row PK조회
const getLastSurveyFormId = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(adminSql.lastFormId);
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

//조사지Item테이블 pk생성용 마지막 row PK조회
const getLastSurveyItemId = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(adminSql.lastItemId);
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
  finally {
    if (conn) {
      conn.release();
    }
  }
};

//조사지 Insert
const insertSurveyAll = async (formData, itemDataList) => {
  let conn = null;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    await conn.query(adminSql.SurveyFormYtoN);

    const formResult = await conn.query(adminSql.SurveyFormInsert, formData);
    if (formResult.affectedRows <= 0) {
      throw new Error("SurveyForm Insert 실패");
    };

    for (const itemData of itemDataList) {
      const itemResult = await conn.query(adminSql.SurveyItemInsert, itemData);

      if (itemResult.affectedRows <= 0) {
        throw new Error("SurveyItem Insert 실패");
      };
    };

    await conn.commit();

    return { status: "Success" };

  } catch (err) {
    await conn.rollback();
    return {
      status: "Failed",
      message: err.message
    };

  } finally {
    if (conn) {
      conn.release();
    }
  }
};


//조사지 listup
const surveyVersionList = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(adminSql.getSurveyVersionList);
    return rows;

  } catch (err) {
    console.log(err);

  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//조사지 버전 사용
const setActiveVersion = async (verId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    let yton = await pool.query(adminSql.useYtoNSql);

    let result = await pool.query(adminSql.useVersionSql, verId);

    if (result.affectedRows <= 0) {
      throw new Error("버전 활성화 실패");
    }
    await conn.commit();
    return true;

  } catch (err) {
    await conn.rollback();
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

const getDetailVersion = async (verId) => {
  let conn = null;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query(adminSql.getSurveyDetail, [verId]);
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};


//조사지 이전버전 불러오기
const getCurrentSurveyDetail = async () => {
  let conn = null;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query(adminSql.getCurrentSurveyDetailSql);
    return rows;

  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//조사지 최근 버전 가져오기
const getLatestVersion = async () => {
  let conn = null;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query(adminSql.latestVersion);
    return rows;

  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports = {
  getLastSurveyFormId,
  getLastSurveyItemId,
  insertSurveyAll,
  adminLogin,
  surveyVersionList,
  setActiveVersion,
  getDetailVersion,
  getCurrentSurveyDetail,
  getLatestVersion
};
