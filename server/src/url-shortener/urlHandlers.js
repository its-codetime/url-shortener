const {
  getUserUrls,
  createNewUrlEntry,
  deleteUrlEntry,
  updateUrlEntry,
  modifyUserUrlLimit,
  getUserUrlLimit,
} = require("./utils");

async function handleGetUrls(req, res, next) {
  try {
    // get user urls and send them back
    const urls = await getUserUrls(req.user.id);
    const urlLimit = await getUserUrlLimit(req.user.id);
    // response
    res.json({ urls, urlLimit });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

async function handleAddUrl(req, res, next) {
  try {
    const userId = req.user.id;
    const url = req.body.url;
    if (!url) {
      // bad request
      res.status(400);
      throw new Error("url is required.");
    }
    // error if user url limit is reached
    const urlLimit = await getUserUrlLimit(userId);
    if (urlLimit < 1) {
      throw new Error(
        "Shortened urls limit reached.Delete old ones to add more"
      );
    }

    // create new url entry
    const newUrl = await createNewUrlEntry(url, userId);
    // decrement user url limit
    const newUrlLimit = await modifyUserUrlLimit(userId, -1);
    // response
    res.json({ newUrl, urlLimit: newUrlLimit });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

async function handleDeleteUrl(req, res, next) {
  try {
    const token = req.body.token;
    if (!token) {
      // bad request
      res.status(400);
      throw new Error("token is required");
    }
    // delete url entry using token
    const deletedUrl = await deleteUrlEntry(token);
    // increment user url limit
    const urlLimit = await modifyUserUrlLimit(req.user.id, 1);
    // response
    res.json({ deletedUrl, urlLimit });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

async function handleEditUrl(req, res, next) {
  try {
    const token = req.body.token;
    const newUrl = req.body.url;
    if (!token || !newUrl) {
      // bad request
      res.status(400);
      throw new Error("token and url fields are required.");
    }
    // delete url entry using token
    const updatedUrl = await updateUrlEntry(token, newUrl);
    // response
    res.json({ updatedUrl });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
}

module.exports = {
  handleGetUrls,
  handleAddUrl,
  handleDeleteUrl,
  handleEditUrl,
};
