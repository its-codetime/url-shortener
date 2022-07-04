const mongoose = require("mongoose");
const User = require("./user.js");

const urlSchema = new mongoose.Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: User, required: true },
  token: { type: String, required: true, index: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model("Url", urlSchema);
