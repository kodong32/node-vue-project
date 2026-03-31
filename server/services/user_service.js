//회원 관련 service
const bcrypt = require("bcrypt");

const userMapper = require("../database/mappers/user_mapper");

const testSelect = () => {
  let list = userMapper.testSelect();
  return list;
};

//일반이용자 회원가입<김경환, mapper에 있는 함수를 라우터에 결과 전달>(김경환 2026.03.24 수정 및 pk 증가로직 추가)
const createUser = async (userObj) => {
  console.log(userObj);
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
    let G_UserId;
    const lastUserId = await userMapper.getLastUserId();
    if (!lastUserId) {
      G_UserId = "GUSR0001";
    } else {
      const num = parseInt(lastUserId.G_UserId.substring(4), 10);
      G_UserId = "GUSR" + String(num + 1).padStart(4, "0");
    }
    //비밀번호 암호화(김경환 20260328)
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    let insertData = [
      G_UserId,
      institution_id,
      name,
      id,
      hashedPw, //암호화된 비번
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
      G_UserId,
    };
  } catch (err) {
    if (err.code !== "ER_DUP_ENTRY") {
      return { status: "Failed", message: err.message };
    }
    if (retry == 2) {
      return { status: "Failed", message: "PK 중복으로 인한 등록 실패" };
    }
  }
};

//기관이용자 회원가입<김경환, mapper에 있는 함수를 라우터에 결과 전달>(김경환 2026.03.24 수정 및 pk 증가로직 추가)
const createInstiUser = async (userObj) => {
  const { institution_id, name, id, password, tel, roll } = userObj;
  try {
    let I_UserId;
    const lastInstiId = await userMapper.getLastInstiId();
    if (!lastInstiId) {
      I_UserId = "IUSR0001";
    } else {
      const num = parseInt(lastInstiId.I_UserId.substring(4), 10);
      I_UserId = "IUSR" + String(num + 1).padStart(4, "0");
    }
    //기관 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hasgedPw = await bcrypt.hash(password, salt);

    let insertData = [I_UserId, institution_id, name, id, hasgedPw, tel, roll];
    console.log(insertData);

    let result = await userMapper.insertInstiUser(insertData);
    return {
      status: result.affectedRows > 0 ? "success" : "fail",
      I_UserId,
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
  }
};

//지원대상자 수정
const supUpdate = async (supId, supInfo) => {
  let updateData = {
    ...supInfo,
    major: Array.isArray(supInfo.major)
      ? supInfo.major.join(",")
      : supInfo.major,
    middle: Array.isArray(supInfo.middle)
      ? supInfo.middle.join(",")
      : supInfo.middle,
  };
  let result = await userMapper.supUpdate(supId, updateData);

  let resObj = {
    status: result.affectedRows > 0 ? "Success" : "Failed",
    target: {
      sup_Id: supId,
      ...supInfo,
    },
  };
  return resObj;
};

//지원대상자 삭제
const supDelete = async (supId) => {
  let result = await userMapper.supDel(supId);
  let resObj = {
    status: result.affectedRows > 0 ? "Success" : "Failed",
    sup_Id: supId,
  };
  return resObj;
};

//지원대상자 목록
const getSupportList = async (supInfo) => {
  let result = await userMapper.supportList(supInfo);
  return result;
};

//일반이용자 마이페이지 접속
const getUserInfo = async (userId) => {
  let result = await userMapper.getUserInfo(userId);

  if (!result) {
    return {
      stats: "Failed",
      message: "사용자 정보를 찾을 수 없습니다.",
    };
  }

  return {
    status: "Success",
    data: result,
  };
};

//로그인 정보 확인(김경환 2026.03.25)(김경환 20260330 일부 수정 및 추가) //
const confirmUser = async (id, password) => {
  // let infos = await userMapper.confirmUser(id);
  // if (!infos || infos.length === 0) {
  //   return { success: false };
  // }

  // let pwMatch = await bcrypt.compare(password, infos[0].password);

  // if (pwMatch) {
  //   return {
  //     success: true,
  //     user: infos[0],
  //   };
  // } else {
  //   return { success: false };
  // }
  //bcrypt 임시방편(암호화 여부 관계없이 로그인) 해결 시 해당 부분 주석
  let user = await userMapper.confirmUser(id);

  if (!user) return { success: false };

  let isMatch;

  // bcrypt 암호화 여부 확인
  if (user.password && user.password.startsWith("$2b$")) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    // 예전 평문 계정
    isMatch = password === user.password;
  }

  if (isMatch) {
    return { success: true, user };
  }

  return { success: false };
};

//기관(김경환 20260330 일부 수정 및 추가)
const confirmInstiUser = async (id, password) => {
  let infos = await userMapper.confirmInstiUser(id, password);
  if (infos.length > 0) {
    return { success: true, user: infos[0], roll: "" };
  } else {
    return { success: false };
  }

  let pwMatch = await bcrypt.compare(password, infos[0].password);

  if (pwMatch) {
    return {
      success: trus,
      user: infos[0],
    };
  } else {
    return { success: false };
  }
};

//아이디 중복 확인
const userIdCheck = async (id) => {
  let info = await userMapper.userIdCheck(id);
  if (info[0].cnt > 0) {
    return { duplicate: true };
  } else {
    return { duplicate: false };
  }
};

//기관 중복 확인
const instiIdCheck = async (id) => {
  let info = await userMapper.instiIdCheck(id);
  if (info[0].cnt > 0) {
    return { duplicate: true };
  } else {
    return { duplicate: false };
  }
};

//기관담당자 조회(김경환 20260331)
const getManagerList = async (roll) => {
  let info = await userMapper.getManagerList(roll);
  return info;
};

//기관관리지의 이용자 회원가입 승인(김경환 20260331)
const waitUser = async (institution_id) => {
  const rows = await userMapper.waitUser(institution_id);
  return {
    success: true,
    data: rows,
  };
};

const agreeUser = async (id) => {
  const result = await userMapper.agreeUser(id);
  return {
    success: true,
    result,
  };
};
module.exports = {
  testSelect,
  createUser,
  createInstiUser,
  supportAdd,
  getSupportList,
  supUpdate,
  supDelete,
  confirmUser,
  confirmInstiUser,
  userIdCheck,
  instiIdCheck,
  getUserInfo,
  getManagerList,
  waitUser,
  agreeUser,
};
