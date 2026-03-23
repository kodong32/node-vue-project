//회원 관련 service
const userMapper = require("../database/mappers/user_mapper");

const testSelect = () => {
  let list = userMapper.testSelect();
  return list;
};

//지원대상자 등록 26.03.23 고동현 등록
const supportAdd = async (supportObj) => {
  const { G_UserId, I_userId1, I_userId2, name, born, gender, relation, zipCode, address, major, middle, sub } = supportObj;

  //Pk증가로직
  //PK중복 방지용 3회 반복문 작성
  // for (let retry = 0; retry < 3; retry++) {
    try {
      let support_id;
      const lastSupportId = await userMapper.getLastSupportId();
      if (!lastSupportId) {
        support_id = "SUP0001";
      } else {
        const num = parseInt(lastSupportId.support_id.substring(3), 10);
        support_id = "SUP" + String(num + 1).padStart(4, "0");
      }
      let insertData = [support_id, G_UserId, I_userId1, I_userId2, name, born, gender, relation, zipCode, address, major, middle, sub];
      console.log(insertData);

      let result = await userMapper.supportAdd(insertData);
      return {
        status : result.affectedRows > 0 ? "Success": "Failed",
        support_id
      };

    }
    catch (err) {
      if(err.code !== "ER_DUP_ENTRY"){ //"ER_DUP_ENTRY" 중복 값에 대한 mariadb 에러코드
        return { status : "Failed", message : err.message };
      }
      if(retry == 2){
        return { status : "Failed", message : "PK 중복으로 인한 등록 실패" };
      }
    }
  // }

};

module.exports = {
  testSelect, supportAdd
};
