require("dotenv").config();
const express = require("express");
const volleyball = require("volleyball");
const cors = require("cors");
const { NotFoundHandler, ErrorHandler } = require("./errorHandlers.js");
const dbConnect = require("./db/connection.js");
const authRoute = require("./auth/routes/authRoute.js");
const urlRoute = require("./url-shortener/urlRoute.js");
const { handleAuthorize } = require("./auth/authHandlers.js");
const { getUrl } = require("./url-shortener/utils.js");

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
    message: "Url shortener server is online",
  });
});

// auth route
app.use("/auth", authRoute);

// url shortener route
app.use("/urls", handleAuthorize, urlRoute);

// url route
app.get("/:urlToken", async function (req, res, next) {
  try {
    const token = req.params.urlToken;
    const url = await getUrl(token);
    console.log(url);
    if (!url) throw new Error("url not found");
    res.redirect(url);
  } catch (error) {
    next();
  }
});
// error handlers
app.use(NotFoundHandler);
app.use(ErrorHandler);

module.exports = app;
