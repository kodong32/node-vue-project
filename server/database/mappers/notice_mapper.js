// src/database/mappers/notice_mapper.js
const { pool } = require("../DAO.js");
const noticeSql = require("../sql/notice_sql.js");

// 💡 새로운 공지사항 ID 생성 헬퍼 (ex: NOTI0001)
const generateNoticeId = async (conn) => {
  const rows = await conn.query(noticeSql.selectMaxNoticeId);
  if (!rows || rows.length === 0 || !rows[0].maxId) return "NOTI0000";

  const lastId = rows[0].maxId; // ex: 'NOTI0012'
  const numPart = parseInt(lastId.substring(4), 10);
  const nextNum = numPart + 1;
  return `NOTI${String(nextNum).padStart(4, "0")}`; // 'NOTI0013'
};

// 💡 1. 공지사항 목록 조회 (대망의 동적 쿼리 마법!)
const getNoticeList = async (userRole, instiId, filters, limit, offset) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    let sql = noticeSql.selectNoticeList;
    let countSql = noticeSql.selectNoticeCount;
    const params = [];
    const countParams = [];

    // 🌟 [권한 필터링]
    // 시스템 관리자는 제한 없음.
    // 기관 소속(관리자, 담당자, 일반)은 'ALL(전체공지)' 이거나 '자신의 기관ID' 인 것만 볼 수 있음!
    if (userRole !== "시스템관리자") {
      const roleCondition = ` AND (notice_type = 'ALL' OR notice_type = ?)`;
      sql += roleCondition;
      countSql += roleCondition;
      params.push(instiId);
      countParams.push(instiId);
    }

    // 🌟 [탭 필터링] (시스템 탭 vs 기관 탭)
    if (filters.tab === "시스템") {
      const tabCondition = ` AND notice_type = 'ALL'`;
      sql += tabCondition;
      countSql += tabCondition;
    } else if (filters.tab === "기관") {
      const tabCondition = ` AND notice_type != 'ALL'`;
      sql += tabCondition;
      countSql += tabCondition;
    }

    // 🌟 [검색 필터링] (제목, 내용, 제목+내용)
    if (filters.keyword && filters.keyword.trim() !== "") {
      const keyword = `%${filters.keyword.trim()}%`;
      let searchCondition = "";

      if (filters.category === "제목") {
        searchCondition = ` AND title LIKE ?`;
        params.push(keyword);
        countParams.push(keyword);
      } else if (filters.category === "내용") {
        searchCondition = ` AND content LIKE ?`;
        params.push(keyword);
        countParams.push(keyword);
      } else if (filters.category === "제목+내용") {
        searchCondition = ` AND (title LIKE ? OR content LIKE ?)`;
        params.push(keyword, keyword);
        countParams.push(keyword, keyword);
      }

      sql += searchCondition;
      countSql += searchCondition;
    }

    // 🌟 [정렬 필터링] (최신순, 오래된순)
    // 중요 공지는 항상 맨 위에 오도록 important_mark DESC를 고정으로 박아둠!
    if (filters.sort === "오래된순") {
      sql += ` ORDER BY create_at ASC, notice_id ASC`;
    } else {
      // 기본값은 최신순
      sql += ` ORDER BY create_at DESC, notice_id DESC`;
    }

    // 🌟 [페이지네이션]
    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const totalCountRows = await conn.query(countSql, countParams);
    const totalCount = totalCountRows[0].totalCount;

    const listRows = await conn.query(sql, params);

    return { totalCount, data: listRows };
  } finally {
    if (conn) conn.release();
  }
};

// 💡 2. 공지사항 상세 조회
const getNoticeDetail = async (noticeId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(noticeSql.selectNoticeDetail, [noticeId]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    if (conn) conn.release();
  }
};

// 💡 3. 공지사항 등록
const createNotice = async (data) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const newNoticeId = await generateNoticeId(conn);

    const params = [
      newNoticeId,
      data.writerType, // ex: 'a001'
      data.writerId, // ex: 'IUSR0001'
      data.title,
      data.content,
      data.file1 || null,
      data.file2 || null,
      data.file3 || null,
      data.file4 || null,
      data.file5 || null,
      data.noticeDate, // 공개 종료 기한
      data.importantMark, // 'Y' or 'N'
      data.noticeType, // 'ALL' 또는 특정 기관 ID
    ];

    await conn.query(noticeSql.insertNotice, params);
    return newNoticeId;
  } finally {
    if (conn) conn.release();
  }
};

// 💡 4. 공지사항 수정
const updateNotice = async (noticeId, data) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const params = [
      data.title,
      data.content,
      data.file1 || null,
      data.file2 || null,
      data.file3 || null,
      data.file4 || null,
      data.file5 || null,
      data.noticeDate,
      data.importantMark,
      data.noticeType,
      noticeId,
    ];
    await conn.query(noticeSql.updateNotice, params);
    return true;
  } finally {
    if (conn) conn.release();
  }
};

// 💡 5. 공지사항 삭제
const deleteNotice = async (noticeId) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.query(noticeSql.deleteNotice, [noticeId]);
    return true;
  } finally {
    if (conn) conn.release();
  }
};

const getTopSystemNotice = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(noticeSql.selectTopSystemNotice);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getNoticeList,
  getNoticeDetail,
  createNotice,
  updateNotice,
  deleteNotice,
  getTopSystemNotice,
};
