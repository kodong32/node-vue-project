//sysadmin service
const adminMapper = require("../database/mappers/admin_mapper.js");

//SysAdmin Login
const sysAdminLogin = async (loginInfo) => {
  try {
    const { id, password } = loginInfo;
    const rows = await adminMapper.adminLogin(id);

    //Id 없을 시
    if (rows.length === 0) {
      return {
        status: "Failed",
        message: "아이디 없음"
      };
    };

    const sysadmin = rows;

    if (sysadmin.password !== password) {
      return {
        status: "Failed",
        message: "비밀번호 틀림"
      };
    };

    return {
      status: "Success",
      user: {
        adminId: sysadmin.Sys_Id,
        id: sysadmin.id,
        role: sysadmin.roll
      }
    }
  }
  catch (err) {
    console.log(err);
  }
};

//조사지생성 Inser
const SurveyInsert = async (surveyObj) => {
  try {
    const {
      Sys_Id,
      version,
      description,
      created_at,
      items
    } = surveyObj;

    let Ver_Id;
    const lastFormRows = await adminMapper.getLastSurveyFormId();

    if (!lastFormRows) {
      Ver_Id = "FORM0001";
    } else {
      const lastVerId = lastFormRows.Ver_Id;
      const num = parseInt(lastVerId.substring(4), 10);
      Ver_Id = "FORM" + String(num + 1).padStart(4, "0");
    };

    let currentNum = 0;
    const lastItemRows = await adminMapper.getLastSurveyItemId();

    if (lastItemRows) {
      const lastQuestionId = lastItemRows.question_id;
      currentNum = parseInt(lastQuestionId.substring(4), 10);
    };

    const FormData = [
      Ver_Id,
      Sys_Id,
      version,
      description,
      created_at
    ];

    const itemDataList = [];
    for (const item of items) {
      currentNum += 1;
      const question_id = "ITEM" + String(currentNum).padStart(4, "0");

      itemDataList.push([
        question_id,
        Ver_Id,
        item.titleCode,
        item.question_no,
        item.question_text,
        item.answer_type
      ]);
    };
    const result = await adminMapper.insertSurveyAll(FormData, itemDataList);
    if (result.status !== "Success") {
      return result;
    }
    return {
      status: "Success",
      Ver_Id
    };

  } catch (err) {
    return {
      status: "Failed",
      message: err.message
    };
  }
};


//조사지 ListUP
const getSurveyVersionList = async () => {
  let rows = await adminMapper.surveyVersionList();
  return {
    status: "Success",
    list: rows,
  };
};

//조사지 버전 사용
const setActiveVersion = async (verId) => {
  let result = await adminMapper.setActiveVersion(verId);

  return {
    status: "Success",
    message: "버전 변경 완료"
  }
};


const getSurveyDetail = async (verId) => {
  const rows = await adminMapper.getDetailVersion(verId);

  if (!rows || rows.length === 0) {
    return {
      status: "Fail",
      message: "해당 버전의 조사지가 없습니다."
    };
  }

  return {
    status: "Success",
    data: rows
  };
};

//이전버전 불러오기
const getCurrentSurveyDetail = async () =>{
  const rows = await adminMapper.getCurrentSurveyDetail();

  if(!rows || rows.length === 0){
    return {
      status : "Failed",
      message : "현재 사용중인 조사지가 없습니다.",
    }
  }
  
  return {
    status : "Success",
    data : rows,
  }
};

module.exports = {
  SurveyInsert, sysAdminLogin, getSurveyVersionList, setActiveVersion,getSurveyDetail, getCurrentSurveyDetail
};
