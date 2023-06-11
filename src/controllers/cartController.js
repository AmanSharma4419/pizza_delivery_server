const Cart = require("../models/cartModel");

const addItemToCart = async (req, res, next) => {
  try {
    const { name, varient, quantity, price, image } = req.body;
    const item = {
      name,
      varient,
      quantity,
      price,
      image,
    };
    const addedItemToCart = await Cart.create(item);
    if (addedItemToCart) {
      return res.status(200).json({ data: addedItemToCart });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { addItemToCart };
