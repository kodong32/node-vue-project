// D:\node-vue-project\server\services\admin_instiuser_service.js
const mapper = require("../database/mappers/admin_instiuser_mapper.js");

const getInstiUserList = async (name, isWaitOnly) => {
  // 🌟 role 삭제
  try {
    const result = await mapper.getInstiUserList(name, isWaitOnly); // 🌟 role 삭제
    return result;
  } catch (err) {
    console.error(`[시스템관리자] 기관관리자 목록 서비스 에러: ${err}`);
    throw err;
  }
};

const approveInstiUsers = async (ids) => {
  try {
    const result = await mapper.approveInstiUsers(ids);
    return result;
  } catch (err) {
    console.error(`[시스템관리자] 기관관리자 승인 서비스 에러: ${err}`);
    throw err;
  }
};

const deleteInstiUsers = async (ids) => {
  try {
    const result = await mapper.deleteInstiUsers(ids);
    return result;
  } catch (err) {
    console.error(`[시스템관리자] 기관관리자 삭제 서비스 에러: ${err}`);
    throw err;
  }
};

const updateInstiUser = async (name, tel, userId) => {
  try {
    const result = await mapper.updateInstiUser(name, tel, userId);
    return result;
  } catch (err) {
    console.error(`[시스템관리자] 기관관리자 수정 서비스 에러: ${err}`);
    throw err;
  }
};

module.exports = {
  getInstiUserList,
  approveInstiUsers,
  deleteInstiUsers,
  updateInstiUser,
};
