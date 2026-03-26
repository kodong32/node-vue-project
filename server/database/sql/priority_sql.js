// priority_sql.js 우선순위 요청

// 지원자 정보
const selectSupportInfo = `
SELECT sp.name as supportName,
    gu.name as generalName,
    sp.born as birthDate,
    sp.gender as genderCode,
    dm.description as disMajorName
FROM Survey_Tbl sv
JOIN Support_Tbl sp ON sv.support_id = sp.support_id
JOIN GeneralUser_Tbl gu ON sv.G_UserId = gu.G_UserId
LEFT JOIN DisMajor_Tbl dm ON sp.major = dm.b_Code
WHERE sv.J_ID = ?;
`;

module.exports = {
  selectSupportInfo,
};
