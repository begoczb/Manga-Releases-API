const router = require("express").Router();
const MangaSeries = require("../models/MangaSeries.model.js");

// Filter Manga Series:
router.get("/", async (req, res, next) => {
  try {
    console.log(req.query);
    const name = req.query.name;
    const authors = req.query.authors;
    const genres = req.query.genres;
    const publisher = req.query.publisher;
    const id = req.query.id;
    const reverseAlphabeticalOrder = req.query.reverseAlphabeticalOrder;
    // console.log(authors.length);
    let mangaSeriesFilter = await MangaSeries.find();

    if (reverseAlphabeticalOrder) {
      mangaSeriesFilter = await MangaSeries.find().sort({ name: -1 });
    }

    if (name) {
      mangaSeriesFilter = await MangaSeries.find({ name: name });
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({ message: "Please provide a series name" });
        return;
      }
    }
    if (authors) {
      mangaSeriesFilter = await MangaSeries.find({
        $or: [{ authors: { $in: authors } }],
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          $or: [{ authors: { $in: authors } }],
        }).sort({ name: -1 });
      }
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({ message: "Please provide an author's name" });
        return;
      }
    }
    if (genres) {
      mangaSeriesFilter = await MangaSeries.find({
        $or: [{ genres: { $in: [genres] } }],
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          $or: [{ genres: { $in: [genres] } }],
        }).sort({ name: -1 });
      }
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({ message: "Please provide a series genre" });
        return;
      }
    }
    if (publisher) {
      mangaSeriesFilter = await MangaSeries.find({ publisher: publisher });
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({ message: "Please provide a publisher name" });
        return;
      }
    }
    if (id) {
      mangaSeriesFilter = await MangaSeries.findById(id);
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.findById(id).sort({ name: -1 });
      }
    }

    if (name && authors) {
      mangaSeriesFilter = await MangaSeries.find({
        $and: [{ name: name }, { $or: [{ authors: { $in: authors } }] }],
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          $and: [{ name: name }, { $or: [{ authors: { $in: authors } }] }],
        }).sort({ name: -1 });
      }
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({
          message: "No matchup found",
        });
        return;
      }
    }
    if (genres && authors) {
      mangaSeriesFilter = await MangaSeries.find({
        $and: [
          {
            $or: [{ authors: { $in: authors } }],
          },
          {
            $or: [{ genres: { $in: [genres] } }],
          },
        ],
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          $and: [
            { $or: [{ authors: { $in: authors } }] },
            { $or: [{ genres: { $in: [genres] } }] },
          ],
        }).sort({ name: -1 });
      }
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({
          message: "No matchup found",
        });
        return;
      }
    }
    res.status(200).json(mangaSeriesFilter);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
