const mongoose = require("mongoose");

const dbConnection = async (url) => {
  return await mongoose.connect(url);
};

module.exports = { dbConnection };
