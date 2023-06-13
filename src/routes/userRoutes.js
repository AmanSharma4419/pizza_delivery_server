const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  forgotPassword,
} = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/profile"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now() + file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post("/add-user", upload.single("avtar"), createUser);
router.post("/login-user", loginUser);
router.post("/forgot-password", forgotPassword);

module.exports = router;
