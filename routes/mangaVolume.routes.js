const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const MangaVolume = require("../models/MangaVolume.model.js");
const MangaSeries = require("../models/MangaSeries.model.js");
const getQueryForSearchVolume = require("../helper/getQueryForSearchVolume");

// get Manga Volume by ID
router.get("/:id", async (req, res, next) => {
  try {
    let mangaVolumeInfo = await MangaVolume.findById(req.params.id);
    if (!mangaVolumeInfo) {
      res
        .status(400)
        .json({ message: "Please provide a correct manga volume id" });
      return;
    }
    res.status(200).json(mangaVolumeInfo);
  } catch (err) {
    next(err);
  }
});

// get all Manga Volume by series
router.get("/series/:id", async (req, res, next) => {
  try {
    let foundMangaSeries = await MangaSeries.findById(req.params.id);
    let allMangaSeriesVolumes = await MangaVolume.find({
      series: foundMangaSeries._id,
    }).sort({ number: 1 });

    if (!foundMangaSeries) {
      res.status(400).json({ message: "Please provide a correct series Id" });
      return;
    }

    res.status(200).json(allMangaSeriesVolumes);
  } catch (err) {
    next(err);
  }
});

// Get query for volumes
router.get("/", async (req, res, next) => {
  try {
    const filter = getQueryForSearchVolume(req.query);
    let mangaVolumeFilter = await MangaVolume.find(filter).collation({
      locale: "en",
    });

    res.status(200).json(mangaVolumeFilter);
  } catch (err) {
    next(err);
  }
});

router.get("/:year/:month", async (req, res, next) => {
  try {
    const { year, month } = req.params;

    const nextMonth = month * 1 + 01;
    const startOfNextMonth = `0${nextMonth}`;

    const foundVolumes = await MangaVolume.find({
      releaseDate: {
        $gte: new Date(`${year}/${month}/01`),
        $lt: new Date(`${year}/${startOfNextMonth}/01`),
      },
    })
      .sort({
        number: 1,
      })
      .populate("series", { name: 1 });

    if (foundVolumes.length === 0) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json(foundVolumes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
