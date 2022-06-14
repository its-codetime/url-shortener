require("dotenv").config();
const express = require("express");
const volleyball = require("volleyball");
const cors = require("cors");
const { NotFoundHandler, ErrorHandler } = require("./errorHandlers.js");
const dbConnect = require("./db/connection.js");
const authRoute = require("./auth/routes/authRoute.js");

// connect to mongo db
dbConnect();

// express app
const app = express();

//cors
app.use(cors());

// http request response logger
app.use(volleyball);

// body parser
app.use(express.json());

// root
app.get("/", (req, res) => {
  res.json({
    message: "Auth&Auth server is online",
  });
});

// auth route
app.use("/auth", authRoute);

// error handlers
app.use(NotFoundHandler);
app.use(ErrorHandler);

module.exports = app;
