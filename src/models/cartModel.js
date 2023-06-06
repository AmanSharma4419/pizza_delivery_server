const mongoose = require("mongoose");

const pricesSchema = new mongoose.Schema({
  small: { type: String, required: true },
  medium: { type: String, required: true },
  large: { type: String, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    varients: [],
    prices: [pricesSchema],
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("CartModel", cartSchema);

module.exports = CartModel;
