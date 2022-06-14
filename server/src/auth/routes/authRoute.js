const express = require("express");
const passwordResetRoute = require("./passwordResetRoute.js");
const {
  handleRegister,
  handleLogin,
  handleCheckUnique,
  handleAuthorize,
} = require("../authHandlers.js");
const router = express.Router();

// auth routes

// register
router.post("/register", handleRegister);

// login
router.post("/login", handleLogin);

// check unique for username and email
router.post("/check-unique", handleCheckUnique);

// authorization
router.get("/authorize", handleAuthorize);

// password reset route
router.use("/password-reset", passwordResetRoute);

module.exports = router;
