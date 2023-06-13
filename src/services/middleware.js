const { verifyAuthToken } = require("./authToken");

const checkAuthTokenInHeaders = (token) => {
  try {
    return (req, res, next) => {
      const authToken = req.cookies[token];
      if (authToken) {
        const userPayload = verifyAuthToken(authToken);
        req.user = userPayload;
        return next();
      } else {
        return next();
      }
    };
  } catch (error) {
    next(error);
  }
};

module.exports = { checkAuthTokenInHeaders };
