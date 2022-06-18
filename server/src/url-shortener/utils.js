const { nanoid } = require("nanoid");
const Url = require("../db/schema/url.js");
const User = require("../db/schema/User.js");

async function getUserUrls(userId) {
  try {
    const urls = await Url.find({ userId: userId }, { userId: 0 });
    return urls;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createNewUrlEntry(url, userId) {
  try {
    // new token for url
    const token = nanoid();
    const newUrl = new Url({
      userId,
      token,
      url,
    });
    await newUrl.validate();
    await newUrl.save();
    return newUrl;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteUrlEntry(token) {
  try {
    const deletedUrl = await Url.findOneAndDelete({ token: token });
    if (deletedUrl === null) {
      throw new Error("token is invalid");
    }
    return deletedUrl;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateUrlEntry(token, newUrl) {
  try {
    const urlEntry = await Url.findOne({ token: token });
    if (urlEntry === null) {
      const error = new Error("token is invalid");
      error.statusCode = 404;
      throw error;
    }
    urlEntry.url = newUrl;
    urlEntry.save();
    return urlEntry;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function modifyUserUrlLimit(userId, value) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { urlLimit: value } },
      { new: true }
    );
    return user.urlLimit;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getUserUrlLimit(userId) {
  try {
    const user = await User.findOne({ _id: userId }, { urlLimit: 1 });
    return user.urlLimit;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getUrl(token) {
  try {
    const urlEntry = await Url.findOne({ token: token });
    return urlEntry.url;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getUserUrls,
  createNewUrlEntry,
  deleteUrlEntry,
  updateUrlEntry,
  modifyUserUrlLimit,
  getUserUrlLimit,
  getUrl,
};
