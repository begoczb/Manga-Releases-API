const router = require("express").Router();
const MangaVolume = require("../models/MangaVolume.model.js");

//
router.get("/", async (req, res, next) => {
  try {
    console.log(req.query);
    const title = req.query.title;
    const ISBN = req.query.ISBN;
    const number = req.query.number;
    const releaseDate = req.query.releaseDate;
    const series = req.query.series;

    let allMangaVolume = await MangaVolume.find();

    if (title) {
      allMangaVolume = await MangaVolume.find({ title: title });
    }
    if (ISBN) {
      allMangaVolume = await MangaVolume.find({ ISBN: ISBN });
    }
    if (number) {
      allMangaVolume = await MangaVolume.find({ number: number });
    }
    if (releaseDate) {
      allMangaVolume = await MangaVolume.find({ releaseDate: releaseDate });
    }
    if (series) {
      allMangaVolume = await MangaVolume.find({series});
    }
    res.status(200).json(allMangaVolume);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
