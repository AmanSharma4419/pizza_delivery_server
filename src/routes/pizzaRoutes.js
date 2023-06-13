const express = require("express");
const router = express.Router();
const { checkAuthTokenInHeaders } = require("../services/middleware");

const { getAllPizzas } = require("../controllers/pizzaController");

router.get("/get-pizzas", checkAuthTokenInHeaders("token"), getAllPizzas);

module.exports = router;
