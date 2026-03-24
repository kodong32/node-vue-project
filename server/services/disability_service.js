const disMapper = require("../database/mappers/disability_mapper");


const getDisList = async () => {
  let list = await disMapper.getDisList();
  return list;
};

const getMidList = async (bCodes) => {
  let list = await disMapper.getMidList(bCodes);
  return list;
};



module.exports = {
  getDisList, getMidList
};

