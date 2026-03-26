// priority_service.js 우선순위 요청
const priorityMapper = require("../database/mappers/priority_mapper.js");

const fetchSupportInfo = async (id) => {
  const result = await priorityMapper.getSupportInfo(id);

  if (!result || result.length === 0) return null;

  let info = result[0];

  if (info.genderCode === "c001") info.genderCode = "남";
  else if (info.genderCode === "c002") info.genderCode = "여";
  else info.genderCode = "알수없음";

  return info;
};

module.exports = {
  fetchSupportInfo,
};
