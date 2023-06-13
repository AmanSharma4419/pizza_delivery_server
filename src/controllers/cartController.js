const { errorMessages } = require("../constants/errorMessages");
const Cart = require("../models/cartModel");
const { setItemIoCart } = require("../services/redisConnection");
const addItemToCart = async (req, res, next) => {
  try {
    console.log(req.user._id, "req.user._id");
    const { name, varient, quantity, price, image } = req.body;
    const item = {
      name,
      varient,
      quantity,
      price,
      image,
      userId: req.user._id,
    };
    const addedItemToCart = await Cart.create(item);
    if (addedItemToCart) {
      setItemIoCart(addItemToCart);
      return res.status(200).json({ data: addedItemToCart });
    }
  } catch (error) {
    next(error);
  }
};

const getItemsFromCart = async (req, res, next) => {
  try {
    const itemListInCart = await Cart.find();
    if (itemListInCart) {
      return res.status(200).json({ data: itemListInCart });
    } else {
      return res.status(404).json({ error: errorMessages.NOT_FOUND });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { addItemToCart, getItemsFromCart };
