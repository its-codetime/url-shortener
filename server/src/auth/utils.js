const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const User = require("../db/schema/User.js");
const PasswordReset = require("../db/schema/passwordReset.js");

const hoursToMs = 3600 * 1000; // hours to ms
// password reset expiry in milliseconds
const passwordResetExpirationTime =
  parseInt(process.env.PASSWORD_RESET_EXPIRATION_TIME) * hoursToMs;

async function checkIfUserExists(username, email) {
  try {
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (user !== null) throw new Error("User already exists");
  } catch (error) {
    error.statusCode = 400;
    throw error;
  }
}

async function createUserAndValidate(userDetails) {
  try {
    const user = new User(userDetails);
    await user.validate();
    await user.save();
    return { username: user.username, email: user.email, id: user._id };
  } catch (error) {
    error.statusCode = 400;
    throw error;
  }
}

async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, 3);
    return hash;
  } catch (error) {
    throw new Error(error.message);
  }
}

function createAuthToken(user) {
  const token = jwt.sign(user, process.env.SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION_TIME,
  });
  return token;
}

async function getUser(search) {
  try {
    const user = await User.findOne(search);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function verifyPassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    if (!match) {
      throw new Error("wrong password");
    }
  } catch (error) {
    error.statusCode = 401;
    throw error;
  }
}

function verifyToken(token) {
  try {
    var decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (error) {
    throw new Error("unauthorized");
  }
}

function validateField(field, value) {
  try {
    switch (field) {
      case "username": {
        if (value.length < 4 || value.length > 20) {
          throw new Error(
            "username length should be between 4 and 20 characters"
          );
        }
        break;
      }
      case "email": {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(value)) throw new Error("invalid email");
        break;
      }
      default:
        break;
    }
  } catch (error) {
    error.statusCode = 400;
    throw error;
  }
}

async function getPasswordResetEntry(search) {
  try {
    const prEntry = await PasswordReset.findOne(search);
    return prEntry;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createNewPasswordResetEntry(userId) {
  try {
    // unique token for password reset
    const token = nanoid();
    // expiry of password reset token
    const expiry = Date.now() + passwordResetExpirationTime;
    // add new entry with user id, token and expiry
    const prEntry = new PasswordReset({
      userId,
      token,
      expiry,
    });
    await prEntry.save();
    return prEntry;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function sendPasswordResetEmail(username, email, token) {
  // send mail(password reset link)
  const mailServer = JSON.parse(process.env.MAIL_SERVER);
  try {
    const transporter = nodemailer.createTransport({
      host: mailServer.host,
      port: mailServer.port,
      secure: false,
      auth: {
        user: mailServer.user,
        pass: mailServer.pass,
      },
    });

    const passwordResetLink = `${process.env.FRONTEND_UPDATE_URL}/${token}`;
    const info = await transporter.sendMail({
      from: "passwordreset@auth.com",
      to: email,
      subject: "Password Reset for your Auth&Auth account",
      text: `Hey ${username} your password reset link is ${token}`,
      html: `<b>Hey ${username} your password reset link is ${passwordResetLink}</b>`,
      priority: "high",
    });
    return info;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function checkPasswordResetExpiry(passwordResetEntry) {
  const { expiry, token } = passwordResetEntry;
  if (Date.now() > expiry) {
    try {
      // delete entry if expired
      await PasswordReset.deleteOne({ token: token });
      throw new Error("link is expired");
    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  }
}

async function updatePasswordHash(userId, password) {
  try {
    // hash new password
    const hash = await hashPassword(password);
    // update password
    const user = await getUser({ _id: userId });
    user.passwordHash = hash;
    user.save();
  } catch (error) {
    throw new Error(error.message);
  }
}

async function removePasswordResetEntry(userId) {
  try {
    await PasswordReset.findOneAndDelete({ userId: userId });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  checkIfUserExists,
  hashPassword,
  createUserAndValidate,
  createAuthToken,
  getUser,
  verifyPassword,
  validateField,
  verifyToken,
  getPasswordResetEntry,
  createNewPasswordResetEntry,
  sendPasswordResetEmail,
  checkPasswordResetExpiry,
  updatePasswordHash,
  removePasswordResetEntry,
};
