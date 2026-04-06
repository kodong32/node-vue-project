// D:\node-vue-project\server\database\sql\admin_instiuser_sql.js

// 💡 1. 소속원 목록 조회 (실제 DB 컬럼명 적용 및 프론트엔드용 이름 매핑)
// 💡 1. 목록 조회 (대기자이거나 기관관리자만 조회, 불필요한 컬럼 제거)
const selectInstiUserList = `
  SELECT 
    U.I_UserId as user_id,
    U.name,
    U.id,
    I.institution_name,
    U.tel,
    CASE 
      WHEN U.approval = 'G002' THEN '대기'
      WHEN U.approval = 'g001' THEN '승인'
      ELSE IFNULL(U.approval, '대기')
    END as state
  FROM InstiUser_Tbl U
  LEFT JOIN Institution_Tbl I ON U.institution_id = I.institution_id
  WHERE (? IS NULL OR I.institution_name LIKE CONCAT('%', ?, '%'))
    AND (? = 'false' OR U.approval = 'G002' OR U.approval = '대기')
    AND (U.roll = 'a002' OR U.roll IS NULL OR U.roll = '') -- 🌟 기관관리자(a002)이거나 방금 가입해서 역할이 없는(대기) 사람만 쏙!
  ORDER BY U.I_UserId DESC
`;

// 💡 2. 승인 시 권한(a002) 자동 부여!
const approveInstiUsers = `
  UPDATE InstiUser_Tbl 
  SET approval = 'g001', roll = 'a002' -- 🌟 승인과 동시에 무조건 '기관관리자'로 임명!
  WHERE I_UserId IN (?)
`;

// 💡 3. 소속원 선택 삭제 (그대로 유지)
const deleteInstiUsers = `
  DELETE FROM InstiUser_Tbl 
  WHERE I_UserId IN (?)
`;

const updateInstiUser = `
  UPDATE InstiUser_Tbl 
  SET name = ?, tel = ? 
  WHERE I_UserId = ?
`;

module.exports = {
  selectInstiUserList,
  approveInstiUsers,
  deleteInstiUsers,
  updateInstiUser,
};
