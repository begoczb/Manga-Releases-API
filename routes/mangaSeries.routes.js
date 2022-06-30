const router = require("express").Router();
const MangaSeries = require("../models/MangaSeries.model.js");
const getQueryForSearch = require("../helper/getQueryForSearch");

// Filter Manga Series:
router.get("/", async (req, res, next) => {
  try {
    const filter = getQueryForSearch(req.query);
    let mangaSeriesFilter = await MangaSeries.find(filter).collation({
      locale: "en",
    });

    res.status(200).json(mangaSeriesFilter);
  } catch (err) {
    next(err);
  }
});

// Route manga series by ID
router.get("/:id", async (req, res, next) => {
  try {
    const mangaSeriesInfo = await MangaSeries.findById(req.params.id);
    if (!mangaSeriesInfo) {
      res
        .status(400)
        .json({ message: "Please provide a correct manga series id" });
      return;
    }
    res.status(200).json(mangaSeriesInfo);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
