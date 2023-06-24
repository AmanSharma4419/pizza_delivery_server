const express = require("express");
const router = express.Router();
const { checkAuthTokenInHeaders } = require("../services/middleware");

const {
  addItemToCart,
  getItemsFromCart,
  itemQuantityChangeWithPrice,
  deleteItemFromCart,
  createOrderPayment,
} = require("../controllers/cartController");

router.post(
  "/add-item-cart",
  checkAuthTokenInHeaders("authToken"),
  addItemToCart
);

router.delete(
  "/remove-cart-item/:itemId",
  checkAuthTokenInHeaders("authToken"),
  deleteItemFromCart
);

router.post(
  "/item-quantity-change",
  checkAuthTokenInHeaders("authToken"),
  itemQuantityChangeWithPrice
);

router.get(
  "/item-list-cart/:userId",
  checkAuthTokenInHeaders("authToken"),
  getItemsFromCart
);

router.post(
  "/order-payment",
  checkAuthTokenInHeaders("authToken"),
  createOrderPayment
);

module.exports = router;
