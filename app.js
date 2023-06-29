const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

const pizzaRoutes = require("./src/routes/pizzaRoutes.js");
const userRoutes = require("./src/routes/userRoutes.js");
const cartRoutes = require("./src/routes/cartRoutes.js");

const PORT = process.env.PORT || 7000;
const { dbConnection } = require("./src/db/db.connection.js");

// Db connection
dbConnection(process.env.DB_URL).then((res) => {
  if (res) {
    return console.log("MongoDb Connected");
  }
});

// Redis connection
require("./src/services/redisConnection.js");

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

// Error handler
app.use((err, req, res, next) => {
  // Set a default error status code if not provided
  const statusCode = err.statusCode || 400;
  // Set the response status code and send the error message
  return res.status(statusCode).json({ error: err.message, code: statusCode });
});

// API Paths
app.use("/api/user", userRoutes);
app.use("/api/pizza", pizzaRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  return res.send("Hello From ExpressJs Server");
});

app.listen(PORT, () => {
  return console.log(`ExpressJs server listening at port ${PORT}`);
});
