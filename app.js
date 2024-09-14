const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJWT = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
require("dotenv").config();

const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const usersRouter = require("./routes/Users");
const orderRouter = require("./routes/order");

const app = express();

app.use(cors());
app.options("*", cors());

// Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJWT());
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads")); // Cho phép F.E xem được ảnh

const port = process.env.PORT;
const apiURL = process.env.API_URL;

// Router
app.use(`${apiURL}/products`, productsRouter);
app.use(`${apiURL}/categories`, categoriesRouter);
app.use(`${apiURL}/users`, usersRouter);
app.use(`${apiURL}/orders`, orderRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Start port ${port} successfully!`);
});
