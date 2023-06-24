const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    orderAmmount: {
      type: Number,
      required: true,
    },
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartModel" }],
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("OrderModel", orderSchema);

module.exports = OrderModel;
