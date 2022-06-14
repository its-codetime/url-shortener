const mongoose = require("mongoose");
const User = require("./User");

const PasswordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: User,
    required: true,
  },
  token: { type: String, required: true },
  expiry: { type: Number, required: true },
});

module.exports = mongoose.model("PasswordReset", PasswordResetSchema);
