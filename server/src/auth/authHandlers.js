const {
  checkIfUserExists,
  hashPassword,
  createUserAndValidate,
  createAuthToken,
  getUser,
  verifyPassword,
  validateField,
  verifyToken,
} = require("./utils");

async function handleRegister(req, res, next) {
  let userDetails = req.body;
  const { username, email, password } = userDetails;
  try {
    if (!username || !email || !password) {
      // bad request
      res.status(400);
      throw new Error("username, email and password fields are required.");
    }
    // check if user already exists
    await checkIfUserExists(username, email);
    // hash the password
    const hash = await hashPassword(password);
    userDetails.passwordHash = hash;
    // validate and add user to db
    const user = await createUserAndValidate(userDetails);
    // create jwt and send it back in response
    user.token = createAuthToken(user);
    // response
    res.json({ user });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

async function handleLogin(req, res, next) {
  let userDetails = req.body;
  const { username, password } = userDetails;
  try {
    if (!username || !password) {
      // bad request
      res.status(400);
      throw new Error("username and password fields are required.");
    }

    // get user and check if user exists
    let user = await getUser({ username });
    if (user === null) {
      res.status(404); // not found
      throw new Error("user not found");
    }
    // verify password
    await verifyPassword(password, user.passwordHash);
    const userDetails = {
      username: user.username,
      email: user.email,
      id: user._id,
    };
    // create token and send back
    userDetails.token = createAuthToken(userDetails);
    // response
    res.json({
      user: userDetails,
    });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

async function handleCheckUnique(req, res, next) {
  // check unique for both username and email
  try {
    const { field, value } = req.body;
    if (!field || !value) {
      // bad request
      res.status(400); // bad request
      throw new Error("Both field and value are required");
    }
    // validate field
    validateField(field, value);
    // error if user exists
    const user = await getUser({ [field]: value });
    if (user !== null) {
      res.status(409); // conflict
      throw new Error(`${field} ${value} already exists`);
    }
    // unique: true if user does not exist
    // response
    res.json({ unique: true, message: `${field} is valid` });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

async function handleAuthorize(req, res, next) {
  try {
    // get token from authorization header
    const authHeader = req.get("Authorization");
    if (!authHeader) throw new Error("unauthorized");
    const headerArr = authHeader.split(" ");
    const token = headerArr[headerArr.length - 1];
    // verify token
    // error if verification is failed
    const user = verifyToken(token);
    const { username, email, id } = user;
    const pathArray = req.originalUrl.split("/");
    const route = pathArray[pathArray.length - 1];
    // respond if authorize route
    if (route === "authorize") {
      res.json({ user: { username, email, id, token } });
      return;
    }
    // if not authorize route, then authorize is used as middleware
    // so attach user to req and call next
    req.user = { username, email, id };
    next();
  } catch (error) {
    res.status(401); // unauthorized
    next(error);
  }
}

module.exports = {
  handleRegister,
  handleLogin,
  handleCheckUnique,
  handleAuthorize,
};
