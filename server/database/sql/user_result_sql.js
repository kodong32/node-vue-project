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
    p.purpose AS planPurpose,    /* 🌟 계획 목표 */
    p.content AS planContent,    /* 🌟 계획 내용 */
    p.support_startDate,
    p.supprot_endDate,
    sp.name AS supportName,      /* 🌟 지원대상자 */
    sp.born AS birthDate,
    sp.gender AS genderCode,
    
    /* 🌟 [버그 2 해결] 콤마로 묶인 장애유형 코드를 쪼개서 한글 이름으로 합치기! */
    (
      SELECT GROUP_CONCAT(dm.description SEPARATOR ', ') 
      FROM DisMajor_Tbl dm 
      WHERE FIND_IN_SET(dm.b_Code, sp.major) > 0
    ) AS disabilityType,
    
    gu.name AS guardianName,     /* 🌟 보호자 */
    iu.name AS managerName       /* 🌟 담당자 */
  FROM PlanResult_Tbl pr
  JOIN Plan_Tbl p ON pr.supportPlan_id = p.supportPlan_id
  JOIN Survey_Tbl sv ON p.J_ID = sv.J_ID
  JOIN Support_Tbl sp ON sv.support_id = sp.support_id
  JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
  LEFT JOIN InstiUser_Tbl iu ON pr.I_UserId = iu.I_UserId
  /* 🚨 기존에 있던 LEFT JOIN DisMajor_Tbl 부분은 위쪽 서브쿼리로 대체했으므로 과감히 삭제! */
  WHERE gu.G_UserId = ? 
    AND pr.state = 'g001' /* 🌟 [버그 1 해결] 일반 유저에게는 무조건 '승인'된 결과서만 보여주기! */
`;

module.exports = { selectUserResultDetail };
