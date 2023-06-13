const { errorMessages } = require("../constants/errorMessages");
const { verifyAuthToken } = require("./authToken");

const checkAuthTokenInHeaders = (token) => {
  try {
    return (req, res, next) => {
      const authToken = req.cookies[token];
      if (authToken) {
        const userPayload = verifyAuthToken(authToken, next);
        req.user = userPayload;
        next();
      } else {
        return res.status(401).json(errorMessages.INVALID_TOKEN);
      }
    };
  } catch (error) {
    next(error);
  }
};

module.exports = { checkAuthTokenInHeaders };
