const express = require("express");
const router = express.Router();

const {
  addItemToCart,
  getItemsFromCart,
} = require("../controllers/cartController");

router.post("/add-item-cart", addItemToCart);
router.get("/item-list-cart", getItemsFromCart);

module.exports = router;
