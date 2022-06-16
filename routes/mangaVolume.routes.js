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

    let mangaVolumeFilter = await MangaVolume.find().collation({
      locale: "en",
    });

    if (reverseOrder) {
      mangaVolumeFilter = await MangaVolume.find()
        .collation({
          locale: "en",
        })
        .sort({ title: -1 });
    }

    if (title) {
      mangaVolumeFilter = await MangaVolume.find({
        title: { $regex: new RegExp(title, "i") },
      }).collation({
        locale: "en",
      });
      if (reverseOrder) {
        mangaVolumeFilter = await MangaVolume.find({
          title: { $regex: new RegExp(title, "i") },
        }).sort({ title: -1 });
      }
      if (mangaVolumeFilter.length === 0) {
        res
          .status(400)
          .json({ message: "Please provide a manga volume title" });
        return;
      }
    }
    if (ISBN) {
      mangaVolumeFilter = await MangaVolume.find({ ISBN: ISBN }).collation({
        locale: "en",
      });
      if (mangaVolumeFilter.length === 0) {
        res
          .status(400)
          .json({ message: "Please provide a good ISBN reference" });
        return;
      }
    }
    if (number) {
      mangaVolumeFilter = await MangaVolume.find({ number: number }).collation({
        locale: "en",
      });
      if (reverseOrder) {
        mangaVolumeFilter = await MangaVolume.find({ number: number })
          .collation({
            locale: "en",
          })
          .sort({
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
      mangaVolumeFilter = await MangaVolume.find({
        releaseDate: releaseDate,
      }).collation({
        locale: "en",
      });
      if (reverseOrder) {
        mangaVolumeFilter = await MangaVolume.find({
          releaseDate: releaseDate,
        })
          .collation({
            locale: "en",
          })
          .sort({
            title: -1,
          });
      }
      if (mangaVolumeFilter.length === 0) {
        res.status(400).json({ message: "Please provide a correct date" });
        return;
      }
    }
    if (series) {
      if (!isValidObjectId(series)) {
        let foundMangaSeries = await MangaSeries.findOne({
          name: { $regex: new RegExp(series, "i") },
        });
        if (foundMangaSeries) {
          mangaVolumeFilter = await MangaVolume.find({
            series: foundMangaSeries._id,
          }).sort({ number: 1 });
          // console.log(mangaVolumeFilter);
        }
        if (reverseOrder) {
          mangaVolumeFilter = await MangaVolume.find({
            series: foundMangaSeries._id,
          }).sort({
            number: -1,
          });
        }
        if (foundMangaSeries?.length === 0 || !foundMangaSeries) {
          res.status(400).json({ message: "No manga series name found" });
          return;
        }
      }
      if (isValidObjectId(series)) {
        mangaVolumeFilter = await MangaVolume.find({ series: series }).sort({
          number: 1,
        });
        if (reverseOrder) {
          mangaVolumeFilter = await MangaVolume.find({ series: series }).sort({
            number: -1,
          });
        }
        if (!mangaVolumeFilter || mangaVolumeFilter.length === 0) {
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
