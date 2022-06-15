const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const MangaVolume = require("../models/MangaVolume.model.js");
const MangaSeries = require("../models/MangaSeries.model.js");

//
router.get("/", async (req, res, next) => {
  try {
    console.log(req.query);
    const title = req.query.title;
    const ISBN = req.query.ISBN;
    const number = req.query.number;
    const releaseDate = req.query.releaseDate;
    const series = req.query.series;
    const reverseOrder = req.query.reverseOrder;

    let mangaVolumeFilter = await MangaVolume.find();

    if (reverseOrder) {
      mangaVolumeFilter = await MangaVolume.find().sort({ title: -1 });
    }

    if (title) {
      mangaVolumeFilter = await MangaVolume.find({ title: title });
      if (mangaVolumeFilter.length === 0) {
        res
          .status(400)
          .json({ message: "Please provide a manga volume title" });
        return;
      }
    }
    if (ISBN) {
      mangaVolumeFilter = await MangaVolume.find({ ISBN: ISBN });
      if (mangaVolumeFilter.length === 0) {
        res
          .status(400)
          .json({ message: "Please provide a good ISBN reference" });
        return;
      }
    }
    if (number) {
      mangaVolumeFilter = await MangaVolume.find({ number: number });
      if (reverseOrder) {
        mangaVolumeFilter = await MangaVolume.find({ number: number }).sort({
          number: -1,
        });
      }
      if (mangaVolumeFilter.length === 0) {
        res
          .status(400)
          .json({ message: "There is no volume wth this number reference" });
        return;
      }
    }
    if (releaseDate) {
      mangaVolumeFilter = await MangaVolume.find({ releaseDate: releaseDate });
      if (reverseOrder) {
        mangaVolumeFilter = await MangaVolume.find({
          releaseDate: releaseDate,
        }).sort({
          releaseDate: -1,
        });
      }
      if (mangaVolumeFilter.length === 0) {
        res.status(400).json({ message: "Please provide a correct date" });
        return;
      }
    }
    if (series) {
      if (!isValidObjectId(series)) {
        foundMangaSeries = await MangaSeries.findOne({
          name: series,
        });
        console.log(foundMangaSeries);
        if (foundMangaSeries) {
          mangaVolumeFilter = await MangaVolume.find({
            series: foundMangaSeries._id,
          });
          // console.log(mangaVolumeFilter);
        }
        if (reverseOrder) {
          mangaVolumeFilter = await MangaVolume.find({
            series: foundMangaSeries._id,
          }).sort({
            number: -1,
          });
        }
        if (foundMangaSeries.length === 0) {
          res.status(400).json({ message: "No manga series name found" });
          return;
        }
      }
      if (isValidObjectId(series)) {
        mangaVolumeFilter = await MangaVolume.findById(series);
        if (reverseOrder) {
          mangaVolumeFilter = await MangaVolume.findById(series).sort({
            number: -1,
          });
        }
        if (mangaVolumeFilter.length === 0) {
          res
            .status(400)
            .json({ message: "Please provide a correct series Id" });
          return;
        }
      }
    }

    res.status(200).json(mangaVolumeFilter);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
