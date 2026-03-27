//admin 관련 middleware
//이 middleware는 admin 관련 back단 api를 보호한다.
//로그안 하여 session이 없으면, api호출이 불가능하도록(ex: postman..등)

const requireAdmin = (req, res, next) => {
  //로그인 안됐을 시
  if (!req.session.loginAdmin) {
    return res.status(401).json({
      status: "Failed",
      message: "로그인이 필요합니다.",
    });
  }

  //관리자 권한이 아닐 시
  if (req.session.loginAdmin.role !== "a001") {
    return res.status(403).json({
      status: "Failed",
      message: "관리자 권한이 없습니다.",
    });
  }

  next();
};

module.exports = {
  requireAdmin,
};
