//회원 관련 service
const userMapper = require("../database/mappers/user_mapper");

const testSelect = () => {
  let list = userMapper.testSelect();
  return list;
};

//일반이용자 회원가입<김경환, mapper에 있는 함수를 라우터에 결과 전달>(김경환 2026.03.24 수정 및 pk 증가로직 추가)
const createUser = async (userObj) => {
  //객체를 배열로 변환
  const {
    institution_id,
    name,
    id,
    password,
    tel,
    email,
    zipCode,
    address,
    document1,
    document2,
  } = userObj;
  try {
    let user_id;
    const lastUserId = await userMapper.getLastUserId();
    if (!lastUserId) {
      insti_id = "GUSR0001";
    } else {
      const num = parseInt(lastUserId.G_UserId.substring(3), 10);
      user_id = "GUSR" + String(num + 1).padStart(4, "0");
    }
    let insertData = [
      user_id,
      institution_id,
      name,
      id,
      password,
      tel,
      email,
      zipCode,
      address,
      document1,
      document2,
    ];
    console.log(insertData);

    let result = await userMapper.insertUser(insertData);
    return {
      status: result.affectedRows > 0 ? "success" : "fail",
      user_id,
    };
  } catch (err) {
    if (err.code !== "ER_DUP_ENTRY") {
      return { status: "Failed", message: err.message };
    }
    if (retry == 2) {
      return { status: "Failed", message: "PK 중복으로 인한 등록 실패" };
    }
  }
  //해당 값을 배열로 생성
};

//기관이용자 회원가입<김경환, mapper에 있는 함수를 라우터에 결과 전달>(김경환 2026.03.24 수정 및 pk 증가로직 추가)
const createInstiUser = async (userObj) => {
  const { institution_id, name, id, password, tel } = userObj;
  try {
    let insti_id;
    const lastInstiId = await userMapper.getLastInstiId();
    if (!lastInstiId) {
      insti_id = "IUSR0001";
    } else {
      const num = parseInt(lastInstiId.I_UserId.substring(3), 10);
      insti_id = "IUSR" + String(num + 1).padStart(4, "0");
    }
    let insertData = [insti_id, institution_id, name, id, password, tel];
    console.log(insertData);

    let result = await userMapper.insertInstiUser(insertData);
    return {
      status: result.affectedRows > 0 ? "success" : "fail",
      insti_id,
    };
  } catch (err) {
    if (err.code !== "ER_DUP_ENTRY") {
      //"ER_DUP_ENTRY" 중복 값에 대한 mariadb 에러코드
      return { status: "Failed", message: err.message };
    }
    if (retry == 2) {
      return { status: "Failed", message: "PK 중복으로 인한 등록 실패" };
    }
  }
};

//지원대상자 등록 26.03.23 고동현 등록
const supportAdd = async (supportObj) => {
  const {
    G_UserId,
    I_userId1,
    I_userId2,
    name,
    born,
    gender,
    relation,
    zipCode,
    address,
    major,
    middle,
    sub,
  } = supportObj;

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
    let insertData = [
      support_id,
      G_UserId,
      I_userId1,
      I_userId2,
      name,
      born,
      gender,
      relation,
      zipCode,
      address,
      major,
      middle,
      sub,
    ];
    console.log(insertData);

    let result = await userMapper.supportAdd(insertData);
    return {
      status: result.affectedRows > 0 ? "Success" : "Failed",
      support_id,
    };
  } catch (err) {
    if (err.code !== "ER_DUP_ENTRY") {
      //"ER_DUP_ENTRY" 중복 값에 대한 mariadb 에러코드
      return { status: "Failed", message: err.message };
    }
    if (retry == 2) {
      return { status: "Failed", message: "PK 중복으로 인한 등록 실패" };
    }
  }
  // }
};

module.exports = {
  testSelect,
  createUser,
  createInstiUser,
  supportAdd,
};
