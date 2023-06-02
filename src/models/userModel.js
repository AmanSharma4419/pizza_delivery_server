const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

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
    salt: {
      type: String,
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
  const user = this;
  if (!user.isModified("password")) return;
  // Creating the salt
  const salt = randomBytes(16).toString();

  // Hashing the password with salt
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  // Updating the salt & password

  this.salt = salt;
  this.password = hashPassword;
  next();
});

userSchema.static(
  "matchPasswordAndCreateToken",
  async function (userEmail, userPassword) {
    const user = await this.findOne({ email: userEmail });
    if (!user) throw new Error("User Not Found");
    const { salt, password } = user;
    const userProvidedPasswordHash = createHmac("sha256", salt)
      .update(userPassword)
      .digest("hex");
    if (userProvidedPasswordHash !== password) {
      throw new Error("Password Not Matched");
    } else {
      console.log(user, "useruseruser");
      return user;
    }
  }
);

const User = mongoose.model("UserModel", userSchema);

module.exports = User;
