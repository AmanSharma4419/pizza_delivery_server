const JWT = require("jsonwebtoken");

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

module.exports = { generateAuthToken };
