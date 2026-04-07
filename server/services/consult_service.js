//상담기록 관련 service
const consultMapper = require("../database/mappers/consult_mapper");

//전체조회
const findAll = async (I_UserId) => {
  let list = await consultMapper.consultList(I_UserId);
  return { data: list || [] };
};

//폼 장애유형 대 선택
const description = async () => {
  let major = await consultMapper.description();
  return major;
};

//폼 장애유형 중 선택
const descriptionMiddle = async (codes) => {
  const allMiddle = await consultMapper.descriptionMiddle();

  if (!codes) return allMiddle;

  const codeArray = Array.isArray(codes)
    ? codes
    : String(codes)
        .split(",")
        .map((c) => c.trim());
  return allMiddle
    .filter((m) => codes.includes(m.j_Code))
    .map((m) => m.description);
};

//폼 상담장소 선택
const placeList = async () => {
  let place = await consultMapper.placeList();
  return place;
};

//폼 상담방법 선택
const methodList = async () => {
  let method = await consultMapper.methodList();
  return method;
};

//폼 담당자 정/부
const manager = async () => {
  let two = await consultMapper.manager();
  return two;
};

//상담기록 등록
const consultAdd = async (info) => {
  let add = await consultMapper.consultAdd(info);
  return add;
};

//상담기록 등록 시 counsult_id 마지막 row를 기준으로 pk 생성
const counsultId = async () => {
  const lastCID = await consultMapper.counsultId();

  let newCID = "CONS0001";

  if (lastCID && lastCID.length > 0) {
    const lastId = lastCID[0].counsult_id;
    const num = parseInt(lastId.substring(4), 10);
    newCID = "CONS" + String(num + 1).padStart(4, "0");
  }
  return newCID;
};

//건별조회
const getMiddleDescriptions = async (codes) => {
  const allMiddle = await consultMapper.descriptionMiddle();

  if (!codes || !Array.isArray(codes)) return [];

  return allMiddle
    .filter((m) => codes.includes(m.j_Code))
    .map((m) => m.description);
};

// 건별조회
const consultDetail = async (counsultId) => {
  const result = await consultMapper.consultDetail(counsultId);
  if (!result || result.length === 0) return [];

  const row = result[0];

  if (row.dis_middle_raw) {
    const middleCodes = row.dis_middle_raw.split(",").map((c) => c.trim());
    const middleDescs = await getMiddleDescriptions(middleCodes);
    row.dis_middle_desc = middleDescs.join(", ");
  } else {
    row.dis_middle_desc = "";
  }

  delete row.dis_middle_raw;

  return [row];
};

// 상담기록 수정
const consultUpdate = async (info) => {
  let result = await consultMapper.consultUpdate(info);
  return result;
};

// 지원대상자 조회
const support = async () => {
  let support = await consultMapper.support();
  return support;
};

//상담기록 삭제
// const remove = async (counsult_id,
//     J_ID,
//     I_UserId,
//     support_id,
//     counsult_date,
//     write_date,
//     counsult_loc,
//     counsult_startTime,
//     counsult_endTime,
//     counsult_content,
//     updated_at,
//     counsult_method,
//     counsult_content2,
//     counsult_content3,
//     counsult_content4) {
//       const result = await consultMapper.remove(counsult_id,
//     J_ID,
//     I_UserId,
//     support_id,
//     counsult_date,
//     write_date,
//     counsult_loc,
//     counsult_startTime,
//     counsult_endTime,
//     counsult_content,
//     updated_at,
//     counsult_method,
//     counsult_content2,
//     counsult_content3,
//     counsult_content4)
//     return result}

module.exports = {
  findAll,
  description,
  placeList,
  methodList,
  manager,
  consultAdd,
  counsultId,
  consultDetail,
  descriptionMiddle,
  consultUpdate,
  support,
};
