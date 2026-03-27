//일반유저 관련 middleware
//이 middleware는 일반유저 관련 back단 api를 보호한다.
//로그인 하여 session이 없으면, api호출이 불가능하도록(ex: postman..등)

//로그인 하지 않았을 때
const requireUser = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      status: "Failed",
      message: "로그인이 필요합니다.",
    });
  }

  next();
};


//본인정보만 조회 가능하게
const requireSameUser = (req, res, next) => {
  const sessionUserId = req.session.user.id;
  const requestUserId = req.params.userId;

  if (sessionUserId !== requestUserId) {
    return res.status(403).json({
      status: "Failed",
      message: "본인 정보만 접근 가능합니다.",
    });
  }

  next();
};

//PK로 접속 시 사용
const requireSameGUser = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      status: "Failed",
      message: "로그인이 필요합니다.",
    });
  }

  const sessionGUserId = req.session.user.G_UserId;
  const requestGUserId = req.params.guserId;

  if (sessionGUserId !== requestGUserId) {
    return res.status(403).json({
      status: "Failed",
      message: "본인 정보만 접근 가능합니다.",
    });
  }

  next();
};


module.exports = {
  requireUser, requireSameUser, requireSameGUser
};
