const User = require("../models/userModel");
const { errorMessages } = require("../constants/errorMessages");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ data: errorMessages.USER_EXISTS });
    }
    const userData = { name: name, email: email, password: password };
    const user = await User.create(userData);
    if (user) {
      return res.status(200).json({ data: user });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const { email, password } = existingUser;
      const user = User.matchPasswordAndCreateToken(email, password);
      // return res.status(200).json({ data: user });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, loginUser };
