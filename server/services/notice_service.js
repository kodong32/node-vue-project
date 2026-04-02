// src/services/notice_service.js
const noticeMapper = require("../database/mappers/notice_mapper.js");

// 💡 날짜를 'YYYY-MM-DD' 형식으로 예쁘게 바꿔주는 헬퍼 함수
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 💡 1. 공지사항 목록 가져오기
const fetchNoticeList = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  // 프론트에서 넘어온 검색/필터 조건들
  const userRole = query.role || "일반이용자"; // 기본값
  const instiId = query.instiId || ""; // 기관 소속일 경우 기관 ID
  const filters = {
    tab: query.tab || "전체",
    category: query.category || "제목",
    keyword: query.keyword || "",
    sort: query.sort || "최신순",
  };

  // 🌟 [추가됨!] 시스템 관리자의 가장 최신 공지 1건을 무조건 가져오기
  // 필터 없는 상태로, 시스템 공지('ALL') 중 최신 1건만 뽑아옴
  const topNoticeRaw = await noticeMapper.getTopSystemNotice();
  let topNotice = null;

  if (topNoticeRaw) {
    topNotice = {
      ...topNoticeRaw,
      create_at: formatDate(topNoticeRaw.create_at),
      notice_date: formatDate(topNoticeRaw.notice_date),
      isImportant: topNoticeRaw.important_mark === "Y",
    };
  }

  const result = await noticeMapper.getNoticeList(
    userRole,
    instiId,
    filters,
    limit,
    offset,
  );

  // 화면에 뿌려주기 좋게 날짜 포맷팅 및 추가 가공
  const formattedData = result.data.map((item) => ({
    ...item,
    create_at: formatDate(item.create_at),
    notice_date: formatDate(item.notice_date),
    // 중요 공지는 화면에서 바로 쓰기 편하게 불리언으로 변환
    isImportant: item.important_mark === "Y",
  }));

  // 🌟 리턴 값에 topNotice 추가!
  return {
    topNotice: topNotice, // 상단 고정 공지
    totalCount: result.totalCount,
    currentPage: page,
    limit: limit,
    data: formattedData, // 일반 목록
  };
};

// 💡 2. 공지사항 상세 가져오기
const fetchNoticeDetail = async (noticeId) => {
  const detail = await noticeMapper.getNoticeDetail(noticeId);
  if (detail) {
    detail.create_at = formatDate(detail.create_at);
    detail.notice_date = formatDate(detail.notice_date);
    detail.isImportant = detail.important_mark === "Y";
  }
  return detail;
};

// 💡 3. 공지사항 등록
const addNotice = async (data) => {
  return await noticeMapper.createNotice(data);
};

// 💡 4. 공지사항 수정
const modifyNotice = async (noticeId, data) => {
  return await noticeMapper.updateNotice(noticeId, data);
};

// 💡 5. 공지사항 삭제
const removeNotice = async (noticeId) => {
  return await noticeMapper.deleteNotice(noticeId);
};

module.exports = {
  fetchNoticeList,
  fetchNoticeDetail,
  addNotice,
  modifyNotice,
  removeNotice,
};
