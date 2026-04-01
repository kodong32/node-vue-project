//상담기록 관련 service
const consultMapper = require("../database/mappers/consult_mapper");

//전체조회
const findAll = async () => {
  let list = await consultMapper.consultList();
  return list;
};

//폼 장애유형 선택
const description = async () => {
  let major = await consultMapper.description();
  return major;
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

//상담기록 리스트 페이징 카운트
const consultCount = async (info) => {
  let count = await consultMapper.consultCount(info);
  return count;
};

module.exports = {
  findAll,
  description,
  placeList,
  methodList,
  manager,
  consultAdd,
  counsultId,
  consultCount,
};
