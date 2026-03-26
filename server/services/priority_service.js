// priority_service.js 우선순위 요청
const priorityMapper = require("../database/mappers/priority_mapper.js");

const fetchSupportInfo = async (id) => {
  const result = await priorityMapper.getSupportInfo(id);

  if (!result || result.length === 0) return null;

  let info = result[0];

  // 성별
  if (info.genderCode === "c001") info.genderCode = "남";
  else if (info.genderCode === "c002") info.genderCode = "여";
  else info.genderCode = "알수없음";

  // 날짜 포맷팅
  if (info.birthDate) {
    const date = new Date(info.birthDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    info.birthDate = `${year}. ${month}. ${day}.`;
  }

  return info;
};

module.exports = {
  fetchSupportInfo,
};
