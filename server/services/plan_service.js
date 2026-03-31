//지원계획서 관련 service
const planMapper = require("../database/mappers/plan_mapper");


const insertPlan = async (data) => {
  const {
    J_ID,
    I_UserId,
    startDate,
    endDate,
    purpose,
    content,
    file,
    file2,
  } = data;

  //Pk 생성
  try {
    const lastPlan = await planMapper.getLastPlanId();

    let supportPlan_id;

    if (lastPlan && lastPlan.supportPlan_id) {
      const lastNum = parseInt(lastPlan.supportPlan_id.replace("PLAN", ""), 10);
      const nextNum = lastNum + 1;
      supportPlan_id = "PLAN" + String(nextNum).padStart(4, "0");
    }

    const param = [
      supportPlan_id,
      J_ID,
      I_UserId,
      startDate,
      endDate,
      purpose,
      content,
      file || null,
      file2 || null,
    ];

    const result = await planMapper.insertPlan(param);

    if (result.affectedRows > 0) {
      return {
        status: "Success",
        supportPlan_id,
        message: "지원계획서 등록 성공",
      };
    } else {
      return {
        status: "Failed",
        messge: "지원계획서 등록 실패"
      };
    }
  } catch (err) {
    console.log(err);
    return {
      status: "Failed",
      message: "서버오류",
      error: err.message,
    };
  }
};

const getSurveyListByInstUser = async (I_UserId) => {
  try {
    const list = await planMapper.getSurveyListByInstUser(I_UserId);

    return {
      status: "Success",
      data: list,
    };

  } catch (err) {
    console.log(err);
    return {
      status: "Failed",
      message: "조사지 불러오기 실패"
    };
  }
};

const getSupportListByInstUser = async (I_UserId, managerName, guardianName, supportName) => {
  try {
    const list = await planMapper.getSupportListByInstUser(I_UserId, managerName, guardianName, supportName);

    return {
      status: "Success",
      data: list,
    };

  } catch (err) {
    console.log(err);
    return {
      status: "Failed",
      message: "지원계획 불러오기 실패"
    };
  }
};
module.exports = { insertPlan, getSurveyListByInstUser, getSupportListByInstUser };
