const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../controllers/userController");

router.post("/add-user", createUser);
router.post("/login-user", loginUser);

module.exports = router;
