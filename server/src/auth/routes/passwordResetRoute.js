const express = require("express");
const {
  handleCreate,
  handleVerify,
  handleUpdate,
} = require("../passwordResetHandlers.js");
const router = express.Router();

// password reset routes

// create
router.post("/create", handleCreate);

// verify
router.post("/verify", handleVerify);

// update
router.patch("/update", handleVerify, handleUpdate);

module.exports = router;
