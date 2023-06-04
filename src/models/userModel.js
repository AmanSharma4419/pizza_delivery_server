const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avtar: {
      type: String,
      default: "https://www.dominos.co.in/files/items/Pepper_Barbeque.jpg",
    },
    isAdmin: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  }
});

userSchema.methods.confirmPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("UserModel", userSchema);

module.exports = User;
