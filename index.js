const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 7000;
const { dbConnection } = require("./src/db/db.connection");

dbConnection(process.env.DB_URL)
  .then(() => {
    return console.log("MongoDb Connected");
  })
  .catch((err) => {
    return console.log(err.message);
  });

app.get("/", (req, res) => {
  return res.send("Hello From ExpressJs Server");
});

app.listen(PORT, () => {
  return console.log(`ExpressJs server listening at port ${PORT}`);
});
