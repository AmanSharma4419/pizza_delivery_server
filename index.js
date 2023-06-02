const express = require("express");

const cors = require("cors");
require("dotenv").config();
const app = express();
const pizzaRoutes = require("./src/routes/pizzaRoutes.js");
const userRoutes = require("./src/routes/userRoutes.js");

const PORT = process.env.PORT || 7000;
const { dbConnection } = require("./src/db/db.connection");

// Db connection
dbConnection(process.env.DB_URL)
  .then((res) => {
    return console.log("MongoDb Connected");
  })
  .catch((err) => {
    return console.log(err.message);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handler
app.use((err, req, res, next) => {
  // Set a default error status code if not provided
  const statusCode = err.statusCode || 500;
  // Set the response status code and send the error message
  res.status(statusCode).json({ error: err.message });
});

// API Paths
app.use("/api/pizza", pizzaRoutes);
app.use("/api/user", userRoutes);


app.get("/", (req, res) => {
  return res.send("Hello From ExpressJs Server");
});

app.listen(PORT, () => {
  return console.log(`ExpressJs server listening at port ${PORT}`);
});
