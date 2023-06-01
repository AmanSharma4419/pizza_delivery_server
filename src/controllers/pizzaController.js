const PizzaModel = require("../models/pizzaModel");

const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await PizzaModel.find();
    if (pizzas) {
      return res.status(200).json({ data: pizzas });
    }
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { getAllPizzas };
