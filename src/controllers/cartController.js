const { errorMessages } = require("../constants/errorMessages");
const Cart = require("../models/cartModel");
const { setItemIoCart } = require("../services/redisConnection");
const addItemToCart = async (req, res, next) => {
  try {
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
    const { userId } = req.params;
    const itemListInCart = await Cart.find({ userId: userId });
    if (itemListInCart) {
      return res.status(200).json({ data: itemListInCart });
    } else {
      return res.status(404).json({ error: errorMessages.NOT_FOUND });
    }
  } catch (error) {
    next(error);
  }
};

const itemQuantityChangeWithPrice = async (req, res, next) => {
  try {
    const { itemId, quantity } = req.query;
    if (!["Increase", "Decrease"].includes(quantity)) {
      return res
        .status(400)
        .json({ error: errorMessages.INVALID_QUANTITY_TYPE });
    }
    const cartItem = await Cart.findById(itemId);
    if (cartItem) {
      if (quantity === "Increase") {
        cartItem.quantity += 1;
      } else {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
          cartItem.quantity = 1;
        }
      }
      const item = await cartItem.save();
      if (item) {
        return res.status(200).json({ data: item });
      }
    } else {
      return res.status(404).json({ error: errorMessages.NOT_FOUND });
    }
  } catch (error) {
    return next(error);
  }
};

const deleteItemFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const removedItem = await Cart.findByIdAndDelete(itemId);
    if (removedItem) {
      return res.status(200).json({ data: removedItem });
    } else {
      return res.status(404).json({ error: errorMessages.NOT_FOUND });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addItemToCart,
  getItemsFromCart,
  itemQuantityChangeWithPrice,
  deleteItemFromCart,
};
