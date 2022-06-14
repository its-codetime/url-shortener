const mongoose = require("mongoose");

// user schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: [4, "Min length should be 4"],
    maxLength: [20, "Max length should be 20"],
    required: [true, "username is required"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
    required: [true, "Email address is required"],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "email not valid"],
  },
  passwordHash: {
    type: String,
    required: [true, "Password is required"],
  },
});

module.exports = mongoose.model("User", UserSchema);
