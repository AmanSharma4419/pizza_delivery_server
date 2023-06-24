const { errorMessages } = require("../constants/errorMessages");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const { setItemIoCart, getCartItems } = require("../services/redisConnection");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
    const itemAddedToCart = await Cart.create(item);
    if (itemAddedToCart) {
      const items = await Cart.find({ userId: req.user._id });
      setItemIoCart(req.user._id + "cartItems", items);
      return res.status(200).json({ data: itemAddedToCart });
    }
  } catch (error) {
    next(error);
  }
};

const getItemsFromCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cartItemsInRedis = await getCartItems(userId + "cartItems");
    if (cartItemsInRedis) {
      const items = JSON.parse(cartItemsInRedis);
      return res.status(200).json({ data: items });
    } else {
      const itemListInCart = await Cart.find({ userId: userId });
      if (itemListInCart) {
        return res.status(200).json({ data: itemListInCart });
      } else {
        return res.status(404).json({ error: errorMessages.NOT_FOUND });
      }
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
    const handleItemQuantityChange = (quantity, item) => {
      if (quantity === "Increase") {
        item.quantity += 1;
      } else {
        item.quantity = Math.max(item.quantity - 1, 1);
      }
    };
    const itemListInCart = await getCartItems(req.user._id + "cartItems");

    if (itemListInCart) {
      const items = JSON.parse(itemListInCart);
      const itemUpBeUpdate = items.filter((value) => value._id === itemId);
      if (itemUpBeUpdate) {
        const item = itemUpBeUpdate[0];
        handleItemQuantityChange(quantity, item);
        setItemIoCart(req.user._id + "cartItems", items);
        return res.status(200).json({ data: item });
      }
    } else {
      const cartItem = await Cart.findById(itemId);
      if (cartItem) {
        handleItemQuantityChange(quantity, cartItem);
        const item = await cartItem.save();
        console.log(item, "cartItemcartItem");
        if (item) {
          return res.status(200).json({ data: item });
        }
      } else {
        return res.status(404).json({ error: errorMessages.NOT_FOUND });
      }
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
      const itemListInCart = await getCartItems(req.user._id + "cartItems");
      if (itemListInCart) {
        const items = JSON.parse(itemListInCart);
        const redisCartItems = items.filter(
          (item) => item._id != removedItem._id
        );
        setItemIoCart(req.user._id + "cartItems", redisCartItems);
      }
      return res.status(200).json({ data: removedItem });
    } else {
      return res.status(404).json({ error: errorMessages.NOT_FOUND });
    }
  } catch (error) {
    next(error);
  }
};

const createOrderPayment = async (req, res, next) => {
  try {
    const { token, totalAmt, cartItemsIds } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: totalAmt * 100,
        currency: "INR",
        customer: customer.id,
        receipt_email: token.email,
      },
      { idempotencyKey: uuidv4() }
    );
    if (payment.status === "succeeded") {
      const { email } = token;
      const { _id } = req.user;
      const {
        address_city,
        address_country,
        address_line1,
        address_zip,
        name,
        id,
      } = token.card;
      const orderDetails = {
        name: name,
        email: email,
        userId: _id,
        shippingAddress: {
          address_city: address_city,
          address_country: address_country,
          address_line1: address_line1,
          address_zip: address_zip,
        },
        orderItems: cartItemsIds,
        orderAmmount: totalAmt,
        transactionId: id,
      };
      const order = await Order.create(orderDetails);
      if (order) {
        return res.status(200).json({ data: payment.status });
      } else {
        return res.status(400).json({ error: errorMessages.ORDER_FAILED });
      }
    } else {
      return res.status(400).json({ error: errorMessages.PAYMENT_FAILED });
    }
  } catch (error) {
    next(error);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const orders = await Order.find({ userId: _id })
      .populate("userId")
      .populate("orderItems");
    if (orders) {
      return res.status(200).json({ data: orders });
    } else {
      return res.status(400).json({ error: errorMessages.NOT_FOUND });
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
  createOrderPayment,
  getOrderDetails,
};
