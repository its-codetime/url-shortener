const router = require("express").Router();
const {
  handleGetUrls,
  handleAddUrl,
  handleDeleteUrl,
  handleEditUrl,
} = require("./urlHandlers.js");

// all urls
router.get("/", handleGetUrls);

// add url
router.post("/", handleAddUrl);

// remove url
router.delete("/", handleDeleteUrl);

// modify url
router.patch("/", handleEditUrl);

module.exports = router;
