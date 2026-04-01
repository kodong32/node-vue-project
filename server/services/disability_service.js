const disMapper = require("../database/mappers/disability_mapper");


const getDisList = async () => {
  let list = await disMapper.getDisList();
  return list;
};

const getMidList = async (bCodes) => {
  let list = await disMapper.getMidList(bCodes);
  return list;
};

const getMajorName = async (bCode) => {
  let info = await disMapper.getMajorName(bCode);
  return info;
};

const getMiddleName = async (jCode) => {
  let info = await disMapper.getMiddleName(jCode);
  return info;
};

module.exports = {
  getDisList, getMidList, getMajorName, getMiddleName
};

