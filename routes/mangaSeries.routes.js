const router = require("express").Router();
const MangaSeries = require("../models/MangaSeries.model.js");

// Get all Manga Series:
router.get("/", async (req, res, next) => {
  try {
    const allMangaSeries = await MangaSeries.find();
    res.status(200).json(allMangaSeries);
  } catch (err) {
    next(err);
  }
});

module.exports = router;