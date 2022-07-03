const router = require("express").Router();

const MangaSeries = require("../models/MangaSeries.model.js");
const MangaVolume = require("../models/MangaVolume.model.js");

const getQueryForSearch = require("../helper/getQueryForSearch");

// Filter Manga Series:
router.get("/", async (req, res, next) => {
  try {
    const filter = getQueryForSearch(req.query);
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (limit > 50) {
      limit = 50;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalDocuments = await MangaSeries.countDocuments(filter);

    const nextPage =
      endIndex < totalDocuments
        ? {
            page: page + 1,
            limit: limit,
          }
        : null;

    const previousPage =
      startIndex > 0
        ? {
            page: page - 1,
            limit: limit,
          }
        : null;

    let mangaSeriesFilter;
    if (req.query.random) {
      mangaSeriesFilter = await MangaSeries.find(filter)
        .collation({
          locale: "en",
        })
        .sort({ _id: -1 })
        .limit(limit)
        .skip(startIndex);
    } else {
      mangaSeriesFilter = await MangaSeries.find(filter)
        .collation({
          locale: "en",
        })
        .limit(limit)
        .skip(startIndex);
    }

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

    res.status(200).json({
      mangaSeriesFilter,
      allPromises,
      nextPage,
      previousPage,
      totalDocuments,
    });
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
