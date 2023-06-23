const PizzaModel = require("../models/pizzaModel");

const getAllPizzas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 6; 
    const totalDocsCount = await PizzaModel.countDocuments();
    const totalPages = Math.ceil(totalDocsCount / pageSize);
    const pizzas = await PizzaModel.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    if (pizzas) {
      return res.status(200).json({ data: pizzas, totalPages });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPizzas };
