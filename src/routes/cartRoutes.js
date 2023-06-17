const express = require("express");
const router = express.Router();
const { checkAuthTokenInHeaders } = require("../services/middleware");

const {
  addItemToCart,
  getItemsFromCart,
} = require("../controllers/cartController");

router.post(
  "/add-item-cart",
  checkAuthTokenInHeaders("authToken"),
  addItemToCart
);
router.get(
  "/item-list-cart/:userId",
  checkAuthTokenInHeaders("authToken"),
  getItemsFromCart
);

module.exports = router;
