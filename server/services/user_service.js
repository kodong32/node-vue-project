//회원 관련 service
const bcrypt = require("bcrypt");

const userMapper = require("../database/mappers/user_mapper.js");
const disabilityService = require("./disability_service");

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
    if (!document1 || !document2) {
      return {
        status: "Failed",
        message: "증빙서류를 모두 업로드해주세요.",
      };
    }
    if (!email || email.trim() === "") {
      return {
        status: "Failed",
        message: "이메일을 입력해주세요.",
      };
    }
    if (!id || id.trim() === "") {
      return { status: "Failed", message: "아이디를 입력해주세요." };
    }

    if (!password || password.trim() === "") {
      return { status: "Failed", message: "비밀번호를 입력해주세요." };
    }

    if (!name || name.trim() === "") {
      return { status: "Failed", message: "이름을 입력해주세요." };
    }
    if (!tel || tel.trim() === "") {
      return { status: "Failed", message: "연락처를 입력해주세요." };
    }
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
      return { status: "Failed", message: "모든 항목을 입력해주세요." };
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
    // 🌟 [추가] 기관 선택 여부 확인
    if (!institution_id) {
      return { status: "Failed", message: "소속 기관을 선택해주세요." };
    }
    if (!id || id.trim() === "") {
      return { status: "Failed", message: "아이디를 입력해주세요." };
    }
    if (!password || password.trim() === "") {
      return { status: "Failed", message: "비밀번호를 입력해주세요." };
    }
    if (!name || name.trim() === "") {
      return { status: "Failed", message: "이름을 입력해주세요." };
    }
    if (!tel || tel.trim() === "") {
      return { status: "Failed", message: "연락처를 입력해주세요." };
    }

    let I_UserId;
    const lastInstiId = await userMapper.getLastInstiId();
    if (!lastInstiId) {
      I_UserId = "IUSR0001";
    } else {
      const num = parseInt(lastInstiId.I_UserId.substring(4), 10);
      I_UserId = "IUSR" + String(num + 1).padStart(4, "0");
    }

    // 기관 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hasgedPw = await bcrypt.hash(password, salt);

    let insertData = [I_UserId, institution_id, name, id, hasgedPw, tel, roll];

    let result = await userMapper.insertInstiUser(insertData);

    return {
      status: result.affectedRows > 0 ? "success" : "fail",
      I_UserId,
    };
  } catch (err) {
    console.error("기관 유저 가입 에러:", err);

    // 🌟 [수정] DB 에러(중복 아이디 등) 발생 시 처리 다듬기
    if (err.code === "ER_DUP_ENTRY") {
      // 아이디(또는 연락처)가 이미 DB에 있을 때 뜨는 에러입니다.
      return {
        status: "Failed",
        message: "이미 사용 중인 아이디거나 중복된 데이터입니다.",
      };
    }

    // 기존의 원인 불명 retry 로직 삭제 후 깔끔하게 서버 에러 반환
    return {
      status: "Failed",
      message: "서버 오류로 인해 등록에 실패했습니다.",
    };
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

//일반이용자 본인정보수정
const updateUserInfo = async (userId, updateInfo) => {
  const {
    institution_id,
    name,
    id,
    tel,
    email,
    zipCode,
    address,
    document1,
    document2,
  } = updateInfo;

  const params = [
    institution_id,
    name,
    id,
    tel,
    email,
    zipCode,
    address,
    document1,
    document2,
    userId,
  ];

  const result = await userMapper.updateUserInfo(params);

  if (!result || result.affectedRows < 1) {
    return {
      status: "Failed",
      message: "사용자 정보 수정 실패",
    };
  }

  return {
    status: "Success",
  };
};

//일반사용자 비밀번호 변경
const changePassword = async (userId, passwordInfo) => {
  const { currentPassword, newPassword, newPasswordConfirm } = passwordInfo;

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return {
      status: "Failed",
      message: "비밀번호를 모두 입력하세요.",
    };
  }

  if (newPassword !== newPasswordConfirm) {
    return {
      status: "Failed",
      message: "새 비밀번호 확인이 일치하지 않습니다.",
    };
  }

  const user = await userMapper.getUserPasswordByGUserId(userId);

  if (!user) {
    return {
      status: "Failed",
      message: "사용자 정보를 찾을 수 없습니다.",
    };
  }

  console.log("currentPassword :", currentPassword);
  console.log("newPassword :", newPassword);
  console.log("newPasswordConfirm :", newPasswordConfirm);
  console.log("user :", user);
  console.log("user.password :", user?.password);

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return {
      status: "Failed",
      message: "현재 비밀번호가 일치하지 않습니다.",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPw = await bcrypt.hash(newPassword, salt);

  const result = await userMapper.updatePassword([hashedPw, userId]);

  if (!result || result.affectedRows < 1) {
    return {
      status: "Failed",
      message: "비밀번호 변경 실패",
    };
  }

  return {
    status: "Success",
    message: "비밀번호 변경 완료",
  };
};

//일반이용자 기관검색
const searchInstitutions = async (searchInfo) => {
  const { sido, sigungu, keyword } = searchInfo;

  const result = await userMapper.searchInstitutions([
    sido || "",
    sido || "",
    sigungu || "",
    sigungu || "",
    keyword || "",
    keyword || "",
  ]);
  return {
    status: "Success",
    data: result,
  };
};

//로그인 정보 확인(김경환 2026.03.25)(김경환 20260330 일부 수정 및 추가) //
const confirmUser = async (id, password) => {
  let user = await userMapper.confirmUser(id);

  if (!user) return { success: false };

  let isMatch;
  if (user.password && user.password.startsWith("$2b$")) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    isMatch = password === user.password;
  }

  // 🌟 [문지기 역할 추가!] 비밀번호가 맞았더라도 여기서 한 번 더 검사합니다.
  if (isMatch) {
    if (user.approval === "g002" || user.approval === "g003") {
      // 성공(true)을 주면 안 되고, 실패(false)와 함께 'unapproved'라는 꼬리표를 달아줍니다!
      return { success: false, reason: "unapproved" };
    }

    // g001(승인)인 사람만 진짜 성공 처리!
    return { success: true, user };
  }

  return { success: false };
};

//일반회원 탈퇴
const withdrawUser = async (G_UserId) => {
  try {
    const result = await userMapper.withdrawUser(G_UserId);

    if (result.affectedRows > 0) {
      return {
        status: "Success",
        message: "회원 탈퇴 처리 완료",
      };
    } else {
      return {
        status: "Failed",
        message: "대상 회원이 없습니다.",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      status: "Failed",
      message: "회원 탈퇴 처리 실패",
    };
  }
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
const getManagerList = async (roll, institution_id) => {
  let info = await userMapper.getManagerList(roll, institution_id);
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

//기관 담당자 마이페이지
const getInstInfo = async (instId) => {
  const result = await userMapper.getInstInfo(instId);
  if (!result) {
    return {
      status: "Failed",
      message: "사용자 정보를 찾을 수 없습니다.",
    };
  }
  return {
    status: "Success",
    data: result,
  };
};

const getSupporterList = async (instId) => {
  let list = await userMapper.getSupporterList(instId);

  const result = await Promise.all(
    (list || []).map(async (item) => {
      let major_name = "";
      let middle_name = "";

      if (item.major) {
        const majorInfo = await disabilityService.getMajorName(item.major);
        major_name = majorInfo?.description || "";
      }

      if (item.middle) {
        const middleInfo = await disabilityService.getMiddleName(item.middle);
        middle_name = middleInfo?.description || "";
      }

      return {
        ...item,
        major_name,
        middle_name,
      };
    }),
  );

  return {
    status: "Success",
    data: result,
  };
};

// 기관 담당자 비밀번호 변경
const changeInstiUserPassword = async (I_UserId, body) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirm } = body;

    if (!I_UserId) {
      return { status: "Failed", message: "로그인 정보 없음" };
    }

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return { status: "Failed", message: "값 누락" };
    }

    if (newPassword !== newPasswordConfirm) {
      return { status: "Failed", message: "비밀번호 확인 불일치" };
    }

    const userInfo = await userMapper.getInstiUserPassword(I_UserId);

    if (!userInfo) {
      return { status: "Failed", message: "사용자 없음" };
    }

    const isMatch = await bcrypt.compare(currentPassword, userInfo.password);

    if (!isMatch) {
      return {
        status: "Failed",
        message: "현재 비밀번호가 틀렸습니다.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await userMapper.updateInstiUserPassword(
      hashedPassword,
      I_UserId,
    );

    if (result.affectedRows > 0) {
      return {
        status: "Success",
        message: "비밀번호 변경 완료",
      };
    }

    return {
      status: "Failed",
      message: "변경 실패",
    };
  } catch (err) {
    console.log(err);
    return {
      status: "Failed",
      message: "서버 오류",
    };
  }
};

const updateInstiUserInfo = async (I_UserId, body) => {
  try {
    const { name, tel } = body;

    if (!I_UserId) {
      return {
        status: "Failed",
        message: "로그인 정보가 없습니다.",
      };
    }

    if (!name || !String(name).trim()) {
      return {
        status: "Failed",
        message: "이름을 입력하세요.",
      };
    }

    if (!tel || !String(tel).trim()) {
      return {
        status: "Failed",
        message: "연락처를 입력하세요.",
      };
    }

    const result = await userMapper.updateInstiUserInfo({
      I_UserId,
      name: String(name).trim(),
      tel: String(tel).trim(),
    });

    if (result.affectedRows > 0) {
      return {
        status: "Success",
        message: "담당자 정보가 수정되었습니다.",
      };
    }

    return {
      status: "Failed",
      message: "수정된 정보가 없습니다.",
    };
  } catch (err) {
    console.log("updateInstiUserInfo service error :", err);
    return {
      status: "Failed",
      message: "담당자 정보 수정 중 오류가 발생했습니다.",
    };
  }
};

const getInstInfoById = async (iUserId) => {
  try {
    const rows = await userMapper.getInstInfoById(iUserId);

    if (rows && rows.length > 0) {
      return {
        status: "Success",
        data: rows[0],
      };
    }

    return {
      status: "Failed",
      message: "기관 정보를 찾을 수 없습니다.",
      data: null,
    };
  } catch (err) {
    console.log(err);
  }
};

//기관 정보수정
const updateInstInfo = async (instId, info) => {
  try {
    const {
      institution_id,
      institution_name,
      institution_tel,
      institution_zipCode,
      institution_address,
      institution_email,
    } = info;

    if (!institution_name || !String(institution_name).trim()) {
      return {
        status: "Failed",
        message: "기관명을 입력하세요.",
      };
    }

    if (!institution_tel || !String(institution_tel).trim()) {
      return {
        status: "Failed",
        message: "기관 연락처를 입력하세요.",
      };
    }

    if (!institution_zipCode || !String(institution_zipCode).trim()) {
      return {
        status: "Failed",
        message: "우편번호를 입력하세요.",
      };
    }

    if (!institution_address || !String(institution_address).trim()) {
      return {
        status: "Failed",
        message: "주소를 입력하세요.",
      };
    }

    // 로그인한 기관 관리자가 이 기관 소속인지 확인
    const authInfo = await userMapper.checkInstitutionAdmin(
      instId,
      institution_id,
    );

    if (!authInfo || authInfo.length === 0) {
      return {
        status: "Failed",
        message: "해당 기관 정보를 수정할 권한이 없습니다.",
      };
    }

    const updateInfo = [
      institution_name,
      institution_tel,
      institution_zipCode,
      institution_address,
      institution_email,
      institution_id,
    ];
    const result = await userMapper.updateInstInfo(updateInfo);

    if (result.affectedRows > 0) {
      return {
        status: "Success",
        message: "기관 정보가 수정되었습니다.",
      };
    }

    return {
      status: "Failed",
      message: "수정된 정보가 없습니다.",
    };
  } catch (err) {
    console.log(err);
  }
};

//기관 내 담당자 조회
const getManagerListByInstitution = async (instId) => {
  const rows = await userMapper.getManagerListByInstitution(instId);

  return {
    status: "Success",
    data: rows || [],
  };
};

//김경환
const getMangerMainSubList = async (instId) => {
  const rows = await userMapper.getMangerMainSubList(instId);
  return {
    status: "Success",
    data: rows || [],
  };
};

//기관 내 담당자가 배정받은 지원대상자정보
const getAssignedSupportListByManager = async (
  loginIUserId,
  institutionId,
  targetIUserId,
) => {
  const rows = await userMapper.getAssignedSupportListByManager(targetIUserId);

  return {
    status: "Success",
    data: rows || [],
  };
};

//기관관리자의 이용자의 담당자 선택(김경환 20260401)
const updateManager = async (instiId1, instiId2, supportId) => {
  const result = await userMapper.updateManager(instiId1, instiId2, supportId);
  return result;
};

//기관관리자의 담당자 승인(김경환 20260401)
const waitInstiUser = async (institution_id) => {
  const rows = await userMapper.waitInstiUser(institution_id);
  return {
    success: true,
    data: rows,
  };
};

const agreeInstiUser = async (id) => {
  const result = await userMapper.agreeInstiUser(id);
  return {
    success: true,
    result,
  };
};

const getSupportInstitutionByJid = async (jid) => {
  const result = await userMapper.getSupportInstitutionByJid(jid);
  return result;
};

const rejectUser = async (id) => {
  const result = await userMapper.rejectUser(id);
  return {
    success: true,
    result,
  };
};

const rejectInstiUser = async (id) => {
  const result = await userMapper.rejectInstUser(id);
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
  updateUserInfo,
  changePassword,
  searchInstitutions,
  getInstInfo,
  getSupporterList,
  changeInstiUserPassword,
  updateInstiUserInfo,
  getInstInfoById,
  updateManager,
  waitInstiUser,
  agreeInstiUser,
  getSupportInstitutionByJid,
  updateInstInfo,
  getManagerListByInstitution,
  getAssignedSupportListByManager,
  withdrawUser,
  getMangerMainSubList,
  rejectUser,
  rejectInstiUser,
};
