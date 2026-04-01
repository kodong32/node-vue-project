const getDisList =
`
SELECT b_Code, description
FROM DisMajor_Tbl
ORDER BY b_Code
`;

const getMidList = (queryStrings) => 
`
SELECT j_Code, b_Code, description
FROM DisMiddle_Tbl
WHERE b_Code IN (${queryStrings})
ORDER BY b_Code, j_Code
`;

const getMajorName = `
SELECT b_Code, description
FROM DisMajor_Tbl
WHERE b_Code = ?
`;

const getMiddleName = `
SELECT j_Code, b_Code, description
FROM DisMiddle_Tbl
WHERE j_Code = ?
`;

module.exports = {
  getDisList, getMidList, getMajorName, getMiddleName
};