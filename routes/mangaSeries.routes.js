const router = require("express").Router();
const MangaSeries = require("../models/MangaSeries.model.js");

// // Get all Manga Series:
// router.get("/", async (req, res, next) => {
//   if (req.query) return next();
//   try {
//     const allMangaSeries = await MangaSeries.find();
//     res.status(200).json(allMangaSeries);
//   } catch (err) {
//     next(err);
//   }
// });

// Filter Manga Series:
router.get("/", async (req, res, next) => {
  try {
    console.log(req.query);
    const name = req.query.name;
    const authors = req.query.authors;
    const genres = req.query.genres;
    const publisher = req.query.publisher;
    const id = req.query.id;
    // console.log(authors.length);

    let mangaSeriesFilter = await MangaSeries.find();
    if (name) {
        mangaSeriesFilter = await MangaSeries.find({ name: name });
      }

    if (authors) {
      mangaSeriesFilter = await MangaSeries.find({
        authors: { $in: [authors] },
      });
    }
    if (genres) {
      mangaSeriesFilter = await MangaSeries.find({
        genres: { $in: [genres] },
      });
    }
    if (publisher) {
      mangaSeriesFilter = await MangaSeries.find({ publisher: publisher });
    }
    if (id) {
      mangaSeriesFilter = await MangaSeries.findById(id);
    }
    if (name + authors) {
      mangaSeriesFilter = await MangaSeries.find({
        $or: [{ name: name }, { authors: { $in: [authors] } }],
      });
    }
    // if (genres + authors) {
    //   mangaSeriesFilter = await MangaSeries.find({
    //     $or: [
    //       { authors: { $in: [authors] } },
    //       {
    //         genres: { $in: [genres] },
    //       },
    //     ],
    //   });
    // }
    // if (publisher + genres) {
    //   mangaSeriesFilter = await MangaSeries.find({
    //     $and: [{ publisher: publisher }, { genres: { $in: [genres] } }],
    //   });
    // }

    res.status(200).json(mangaSeriesFilter);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
