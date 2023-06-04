const mongoose = require("mongoose");

const dbConnection = async (url) => {
  try {
    return await mongoose.connect(url);
  } catch (error) {
    console.log(`MongoDb Connection Failed ${error.message}`);
  }
};

module.exports = { dbConnection };
