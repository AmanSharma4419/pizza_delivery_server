const JWT = require("jsonwebtoken");
const { errorMessages } = require("../constants/errorMessages");

const generateAuthToken = (user) => {
  try {
    const { name, email, _id } = user;
    const payload = {
      _id: _id,
      name: name,
      email: email,
    };
    const authToken = JWT.sign(payload, process.env.JWT_SECRET);
    if (authToken) {
      return authToken;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyAuthToken = (token) => {
  const payload = JWT.verify(token, process.env.JWT_SECRET);
  return payload;
};

module.exports = { generateAuthToken, verifyAuthToken };
