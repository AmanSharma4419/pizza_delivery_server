const express = require("express");
const router = express.Router();
const { addItemToCart } = require("../controllers/pizzaController");

router.post("/add-item-cart", addItemToCart);

module.exports = router;
