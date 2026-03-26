// main_sql.js 메인페이지
// (SELECT name FROM Support_Tbl WHERE support_id = sv.support_id) as supportName,
// 공통 쿼리 분리
const baseSelect = `
SELECT gu.name as generalName,
      iu.name as instiName,
      su.name as supportName,
      sv.created_at as registerDate,
      sv.result as priorityCode,
      sv.J_ID as surveyId,
      (
        (SELECT COUNT(*) FROM Plan_Tbl p WHERE p.J_ID = sv.J_ID AND (p.state IS NULL OR p.state NOT IN ('g001', 'g002'))) + 
        (SELECT COUNT(*) FROM PlanResult_Tbl r JOIN Plan_Tbl p ON r.supportPlan_id = p.supportPlan_id WHERE p.J_ID = sv.J_ID AND (r.state IS NULL OR r.state NOT IN ('g001', 'g002')))
      ) as reviewCount,
      (SELECT COUNT(*) FROM Plan_Tbl p WHERE p.J_ID = sv.J_ID AND p.state = 'g001') as planCount,
      (
        (SELECT COUNT(*) FROM Plan_Tbl p WHERE p.J_ID = sv.J_ID AND p.state = 'g002') + 
        (SELECT COUNT(*) FROM PlanResult_Tbl r JOIN Plan_Tbl p ON r.supportPlan_id = p.supportPlan_id WHERE p.J_ID = sv.J_ID AND r.state = 'g002')
      ) as rejectCount,
      (SELECT COUNT(*) FROM PlanResult_Tbl r JOIN Plan_Tbl p ON r.supportPlan_id = p.supportPlan_id WHERE p.J_ID = sv.J_ID AND r.state = 'g001') as finishCount,
      (SELECT COUNT(*) FROM Plan_Tbl p WHERE p.J_ID = sv.J_ID) as hasPlanCount,
      (SELECT COUNT(*) FROM PlanResult_Tbl r JOIN Plan_Tbl p ON r.supportPlan_id = p.supportPlan_id WHERE p.J_ID = sv.J_ID) as hasResultCount
FROM Survey_Tbl sv  /* 🌟 무조건 조사지(Survey)가 뼈대가 되어야 해! */
JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
JOIN Support_Tbl su ON sv.support_id = su.support_id  /* 🌟 G_UserId가 아니라 support_id로 연결! */
LEFT JOIN InstiUser_Tbl iu ON su.I_UserId1 = iu.I_UserId
`;

const baseCount = `
SELECT COUNT(sv.J_ID) as totalCount
FROM Survey_Tbl sv  /* 🌟 위랑 똑같이! */
JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
JOIN Support_Tbl su ON sv.support_id = su.support_id  /* 🌟 위랑 똑같이! */
LEFT JOIN InstiUser_Tbl iu ON su.I_UserId1 = iu.I_UserId
`;

// ==========================================
// 일반 이용자 (USER): 자기 것만 본다
// ==========================================
const selectByUser =
  baseSelect +
  `
WHERE gu.G_UserId = ? 
ORDER BY sv.created_at DESC, sv.J_ID DESC
LIMIT ? OFFSET ?
`;

const countByUser =
  baseCount +
  `
WHERE gu.G_UserId = ?
`;

// ==========================================
// 기관 담당자 (MANAGER): "나에게 배정된 것"만 본다
// ==========================================
const selectByManager =
  baseSelect +
  `
WHERE su.I_UserId1 = ? 
ORDER BY sv.created_at DESC, sv.J_ID DESC
LIMIT ? OFFSET ?
`;

const countByManager =
  baseCount +
  `
WHERE su.I_UserId1 = ?
`;

// ==========================================
// 기관 관리자 (GENERAL): 담당자 유무 상관없이 소속 기관 전체를 본다
// ==========================================
const selectByGeneral =
  baseSelect +
  `
WHERE gu.institution_id = ? 
ORDER BY sv.created_at DESC, sv.J_ID DESC
LIMIT ? OFFSET ?
`;

const countByGeneral =
  baseCount +
  `
WHERE gu.institution_id = ?
`;

module.exports = {
  selectByUser,
  countByUser,
  selectByManager,
  countByManager,
  selectByGeneral,
  countByGeneral,
};
