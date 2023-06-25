const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { errorMessages } = require("../constants/errorMessages");
const {
  setLoggedInUser,
  getLoggedInUser,
} = require("../services/redisConnection");

const { sendMailWithPassword } = require("../services/mailService");
const { generateAuthToken } = require("../services/authToken");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(200)
        .json({ data: { data: errorMessages.USER_EXISTS } });
    }
    const userData = {
      name,
      email,
      password,
      avtar: `profile/${req.file.filename}`,
    };
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
    const { email, password } = req.body;
    const loggedInUserInfoInRedis = await getLoggedInUser(email);
    if (loggedInUserInfoInRedis) {
      if (loggedInUserInfoInRedis) {
        const loggedInUserInfo = JSON.parse(loggedInUserInfoInRedis);
        return res
          .status(200)
          .cookie("authToken", loggedInUserInfo.authToken, {
            expires: new Date(Date.now() + 604800000),
            secure: true,
          })
          .json({ data: loggedInUserInfo });
      }
    } else {
      const existingUser = await User.findOne({ email: email }).exec();
      if (existingUser) {
        const isPasswordVerified = existingUser.confirmPassword(password);
        if (isPasswordVerified) {
          const loggedInUserInfo = existingUser._doc;
          const authToken = generateAuthToken(existingUser);
          setLoggedInUser({ ...loggedInUserInfo, authToken });
          return res
            .status(200)
            .cookie("authToken", authToken, {
              expires: new Date(Date.now() + 604800000),
              secure: true,
            })
            .json({ data: loggedInUserInfo });
        } else {
          return res.status(400).json({ data: errorMessages.INVALID_PASSWORD });
        }
      } else {
        return res.status(400).json({ data: errorMessages.USER_NOT_FOUND });
      }
    }
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email: email }).exec();
    if (existingUser) {
      sendMailWithPassword(req, res, next, existingUser);
    } else {
      return res.status(400).json({ data: errorMessages.USER_NOT_FOUND });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, loginUser, forgotPassword };
