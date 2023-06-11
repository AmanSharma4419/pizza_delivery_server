const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  forgotPassword,
} = require("../controllers/userController");

router.post("/add-user", createUser);
router.post("/login-user", loginUser);
router.post("/forgot-password", forgotPassword);
module.exports = router;
