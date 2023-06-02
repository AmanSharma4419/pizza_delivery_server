const PizzaModel = require("../models/pizzaModel");

const getAllPizzas = async (req, res, next) => {
  try {
    const pizzas = await PizzaModel.find();
    if (pizzas) {
      return res.status(200).json({ data: pizzas });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPizzas };
