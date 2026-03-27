const requireInstUser = (req, res, next ) => {
  if(!req.session.loginInstUser){
    return res.status(401).json({
      status : "Failed",
      message : "로그인이 필요합니다.",
    });
  }

  next();
};


const requireInstRole = (req, res, next) => {
  if(!req.session.loginInstUser){
    return res.status(401).json({
      status : "Failed",
      message : "로그인이 필요합니다."
    });
  }

  const role = req.session.loginInstUser.role;

  if(role !== "a002" && !== "a003"){ //a002 == 관리자, a003 == 담당자
    return res.status(403).json({
      status : "Failed",
      message : "권한이 없습니다.",
    });
  }
};


module.exports = { requireInstUser, requireInstRole };