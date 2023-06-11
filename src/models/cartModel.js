const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    varient: {
      type: String,
      enum: ["small", "large", "medium"],
      required: true,
    },
    quantity: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      required: true,
    },
    price: { type: Number },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("CartModel", cartSchema);

module.exports = CartModel;
