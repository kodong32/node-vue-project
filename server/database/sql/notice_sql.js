// src/database/sql/notice_sql.js

// 💡 1. 공지사항 목록 조회 (기본 뼈대)
// - 목록에서는 만료일(notice_date)이 오늘 이후인 것만 보여줌! (DB에는 남아있지만 화면엔 안 보임)
// - 중요 공지(important_mark = 'Y')가 위로 오고, 그 다음 최신순 정렬
const selectNoticeList = `
  SELECT 
    notice_id, 
    writer_type, 
    writer_id, 
    title,
    content, 
    create_at, 
    notice_date, 
    important_mark, 
    notice_type
  FROM Notice_Tbl
  WHERE notice_date >= CURRENT_DATE() 
`;
// 🚨 주의: 권한(시스템관리자/일반)과 검색 조건에 따라 Mapper에서 WHERE 절(AND notice_type = 'ALL' 등)을 동적으로 이어 붙일 예정!

// 💡 2. 공지사항 전체 개수 조회 (페이지네이션용)
const selectNoticeCount = `
  SELECT COUNT(*) AS totalCount
  FROM Notice_Tbl
  WHERE notice_date >= CURRENT_DATE()
`;

// 💡 3. 공지사항 상세 조회 (조회수 기능은 없으므로 단순 SELECT)
const selectNoticeDetail = `
  SELECT * FROM Notice_Tbl 
  WHERE notice_id = ?
`;

// 💡 4. 새로운 공지사항 ID 생성을 위한 마지막 ID 조회
const selectMaxNoticeId = `
  SELECT MAX(notice_id) AS maxId 
  FROM Notice_Tbl
`;

// 💡 5. 공지사항 등록 (INSERT)
const insertNotice = `
  INSERT INTO Notice_Tbl (
    notice_id, writer_type, writer_id, title, content, 
    create_at, file1, file2, file3, file4, file5, 
    notice_date, important_mark, notice_type
  ) VALUES (
    ?, ?, ?, ?, ?, 
    CURRENT_DATE(), ?, ?, ?, ?, ?, 
    ?, ?, ?
  )
`;

// 💡 6. 공지사항 수정 (UPDATE) - 수정할 때 작성일(create_at)은 안 바뀜
const updateNotice = `
  UPDATE Notice_Tbl 
  SET 
    title = ?, 
    content = ?, 
    file1 = ?, 
    file2 = ?, 
    file3 = ?, 
    file4 = ?, 
    file5 = ?, 
    notice_date = ?, 
    important_mark = ?, 
    notice_type = ?
  WHERE notice_id = ?
`;

// 💡 7. 공지사항 삭제 (DELETE)
const deleteNotice = `
  DELETE FROM Notice_Tbl 
  WHERE notice_id = ?
`;

// 최상단 독립 공간용 (시스템 공지 중 가장 최신 글 1개 - 중요도 무시하고 무조건 최신!)
const selectTopSystemNotice = `
  SELECT * FROM Notice_Tbl 
  WHERE notice_type = 'ALL' AND notice_date >= CURRENT_DATE()
  ORDER BY notice_id DESC 
  LIMIT 1
`;

module.exports = {
  selectNoticeList,
  selectNoticeCount,
  selectNoticeDetail,
  selectMaxNoticeId,
  insertNotice,
  updateNotice,
  deleteNotice,
  selectTopSystemNotice,
};
