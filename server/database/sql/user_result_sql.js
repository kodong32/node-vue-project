// src/database/sql/user_result_sql.js

const selectUserResultDetail = `
  SELECT 
    pr.result_report,
    pr.supportPlan_id,
    pr.result AS resultTitle,    /* 🌟 결과 제목 */
    pr.content AS resultContent, /* 🌟 결과 내용 */
    pr.file1,
    pr.file2,
    pr.created_at,               /* 🌟 작성일 */
    pr.state,
    pr.reject_reason,
    p.purpose AS planPurpose,    /* 🌟 계획 목표 (title이 아니라 purpose 였네요!) */
    p.content AS planContent,    /* 🌟 계획 내용 */
    p.support_startDate,
    p.supprot_endDate,
    sp.name AS supportName,      /* 🌟 지원대상자 */
    sp.born AS birthDate,
    sp.gender AS genderCode,
    dm.description AS disabilityType,
    gu.name AS guardianName,     /* 🌟 보호자 */
    iu.name AS managerName       /* 🌟 담당자 */
  FROM PlanResult_Tbl pr
  JOIN Plan_Tbl p ON pr.supportPlan_id = p.supportPlan_id
  JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
  JOIN Support_Tbl sp ON sv.support_id = sp.support_id
  JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
  LEFT JOIN InstiUser_Tbl iu ON pr.I_UserId = iu.I_UserId /* 💡 작성한 담당자 조인 */
  LEFT JOIN DisMajor_Tbl dm ON sp.major = dm.b_Code
  WHERE gu.G_UserId = ? 
`;

module.exports = { selectUserResultDetail };
