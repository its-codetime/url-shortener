const {
  getUser,
  getPasswordResetEntry,
  createNewPasswordResetEntry,
  sendPasswordResetEmail,
  checkPasswordResetExpiry,
  updatePasswordHash,
  removePasswordResetEntry,
} = require("./utils");

async function handleCreate(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      // bad request
      res.status(400);
      throw new Error("email is required");
    }
    // get user by email
    // error if user does not exist
    const user = await getUser({ email });
    if (user === null) {
      // user with email not found
      res.status(404);
      throw new Error(`user with email ${email} does not exist`);
    }
    // check and error if password reset entry already exists
    let passwordResetEntry = await getPasswordResetEntry({ user: user._id });
    if (passwordResetEntry !== null) {
      res.status(409); // conflict as entry already exists
      throw new Error(
        "reset entry already exists. email has already been sent"
      );
    }

    // create new password reset entry
    passwordResetEntry = await createNewPasswordResetEntry(user._id);

    // send email with link
    await sendPasswordResetEmail(
      user.username,
      user.email,
      passwordResetEntry.token
    );
    // response
    res.json({ emailSent: true });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

async function handleVerify(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) {
      // bad request
      res.status(400);
      throw new Error("token is required");
    }
    // get password reset entry
    // error if entry does not exist
    const passwordResetEntry = await getPasswordResetEntry({ token });
    if (passwordResetEntry === null) {
      res.status(400);
      throw new Error("link is invalid");
    }
    // check token for expiry
    await checkPasswordResetExpiry(passwordResetEntry);
    // get current route
    const pathArray = req.originalUrl.split("/");
    const route = pathArray[pathArray.length - 1];
    // send back response if verify route
    if (route === "verify") {
      // response
      res.json({ linkValid: true });
      return;
    }
    // if not "verify" route
    // attach passwordResetEntry for update and call next
    req.passwordResetEntry = passwordResetEntry;
    next();
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

async function handleUpdate(req, res, next) {
  try {
    const { password } = req.body;
    if (!password) {
      // bad request
      res.status(400);
      throw new Error("password is required");
    }
    // get password reset entry from req after handleVerify
    const userId = req.passwordResetEntry.userId;
    await updatePasswordHash(userId, password);
    // delete password reset entry from collection
    await removePasswordResetEntry(userId);
    // response
    res.json({ passwordUpdate: true });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

module.exports = { handleCreate, handleVerify, handleUpdate };
