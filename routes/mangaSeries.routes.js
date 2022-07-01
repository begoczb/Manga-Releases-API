const router = require("express").Router();
const MangaSeries = require("../models/MangaSeries.model.js");

const getQueryForSearch = require("../helper/getQueryForSearch");
const MangaVolume = require("../models/MangaVolume.model.js");

// Filter Manga Series:
router.get("/", async (req, res, next) => {
  try {
    const filter = getQueryForSearch(req.query);
    let mangaSeriesFilter = await MangaSeries.find(filter).collation({
      locale: "en",
    });

    // console.log(mangaSeriesFilter);

    let allCovers = mangaSeriesFilter.map(async (series) => {
      const coverImg = await MangaVolume.find({ series: series._id })
        .sort({ number: 1 })
        .limit(1);

      if (!coverImg[0]) {
        coverImg[0] = { cover: "no image" };
      }
      // console.log(coverImg[0].cover);

      return coverImg[0].cover;
    });

    const allPromises = await Promise.all(allCovers);
    // console.log(allCovers);

    res.status(200).json({ mangaSeriesFilter, allPromises });
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
