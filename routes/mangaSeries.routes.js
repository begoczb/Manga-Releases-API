const router = require("express").Router();
const MangaSeries = require("../models/MangaSeries.model.js");

// Filter Manga Series:
router.get("/", async (req, res, next) => {
  try {
    console.log(req.query);
    let name = req.query.name;
    let authors = req.query.authors;
    let genres = req.query.genres;
    let publisher = req.query.publisher;
    const id = req.query.id;
    const reverseAlphabeticalOrder = req.query.reverseAlphabeticalOrder;

    let mangaSeriesFilter = await MangaSeries.find().collation({
      locale: "en",
    });

    if (reverseAlphabeticalOrder) {
      mangaSeriesFilter = await MangaSeries.find()
        .collation({
          locale: "en",
        })
        .sort({ name: -1 });
    }

    if (name) {
      mangaSeriesFilter = await MangaSeries.find({
        name: { $regex: new RegExp(name, "i") },
      }).collation({
        locale: "en",
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          name: { $regex: new RegExp(name, "i") },
        })
          .collation({
            locale: "en",
          })
          .sort({ name: -1 });
      }
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({ message: "Please provide a series name" });
        return;
      }
    }
    if (authors) {
      if (typeof authors === "string") {
        authors = [authors];
      }
      mangaSeriesFilter = await MangaSeries.find({
        $or: [
          {
            authors: { $in: authors.map((author) => new RegExp(author, "i")) },
          },
        ],
      }).collation({
        locale: "en",
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          $or: [
            {
              authors: {
                $in: authors.map((author) => new RegExp(author, "i")),
              },
            },
          ],
        })
          .collation({
            locale: "en",
          })
          .sort({ name: -1 });
      }
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({ message: "Please provide an author's name" });
        return;
      }
    }
    if (genres) {
      if (typeof genres === "string") {
        authors = [genres];
      }
      mangaSeriesFilter = await MangaSeries.find({
        $or: [
          { genres: { $in: genres.map((genre) => new RegExp(genre, "i")) } },
        ],
      }).collation({
        locale: "en",
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          $or: [
            { genres: { $in: genres.map((genre) => new RegExp(genre, "i")) } },
          ],
        })
          .collation({
            locale: "en",
          })
          .sort({ name: -1 });
      }
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({ message: "Please provide a series genre" });
        return;
      }
    }
    if (publisher) {
      mangaSeriesFilter = await MangaSeries.find({
        publisher: { $regex: new RegExp(publisher, "i") },
      }).collation({
        locale: "en",
      });
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({ message: "Please provide a publisher name" });
        return;
      }
    }
    if (id) {
      mangaSeriesFilter = await MangaSeries.findById(id).collation({
        locale: "en",
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.findById(id)
          .collation({
            locale: "en",
          })
          .sort({ name: -1 });
      }
    }

    if (name && authors) {
      if (typeof authors === "string") {
        authors = [authors];
      }
      mangaSeriesFilter = await MangaSeries.find({
        $and: [
          { name: { $regex: new RegExp(name, "i") } },
          {
            $or: [
              {
                authors: {
                  $in: authors.map((author) => new RegExp(author, "i")),
                },
              },
            ],
          },
        ],
      }).collation({
        locale: "en",
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          $and: [
            { name: { $regex: new RegExp(name, "i") } },
            {
              $or: [
                {
                  authors: {
                    $in: authors.map((author) => new RegExp(author, "i")),
                  },
                },
              ],
            },
          ],
        })
          .collation({
            locale: "en",
          })
          .sort({ name: -1 });
      }
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({
          message: "No matchup found",
        });
        return;
      }
    }
    if (genres && authors) {
      if (typeof genres === "string") {
        genres = [genres];
      }
      if (typeof authors === "string") {
        authors = [authors];
      }
      mangaSeriesFilter = await MangaSeries.find({
        $and: [
          {
            $or: [
              {
                authors: {
                  $in: authors.map((author) => new RegExp(author, "i")),
                },
              },
            ],
          },
          {
            $or: [
              {
                genres: { $in: genres.map((genre) => new RegExp(genre, "i")) },
              },
            ],
          },
        ],
      }).collation({
        locale: "en",
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          $and: [
            {
              $or: [
                {
                  authors: {
                    $in: authors.map((author) => new RegExp(author, "i")),
                  },
                },
              ],
            },
            {
              $or: [
                {
                  genres: {
                    $in: genres.map((genre) => new RegExp(genre, "i")),
                  },
                },
              ],
            },
          ],
        })
          .collation({
            locale: "en",
          })
          .sort({ name: -1 });
      }
      if (mangaSeriesFilter.length === 0) {
        res.status(400).json({
          message: "No matchup found",
        });
        return;
      }
    }
    if (publisher && genres) {
      if (typeof genres === "string") {
        genres = [genres];
      }
      mangaSeriesFilter = await MangaSeries.find({
        $and: [
          {
            $or: [
              {
                genres: { $in: genres.map((genre) => new RegExp(genre, "i")) },
              },
            ],
          },
          { publisher: publisher },
        ],
      }).collation({
        locale: "en",
      });
      if (reverseAlphabeticalOrder) {
        mangaSeriesFilter = await MangaSeries.find({
          $and: [
            {
              $or: [
                {
                  genres: {
                    $in: genres.map((genre) => new RegExp(genre, "i")),
                  },
                },
              ],
            },
            { publisher: publisher },
          ],
        })
          .collation({
            locale: "en",
          })
          .sort({ name: -1 });
      }
    }

    res.status(200).json(mangaSeriesFilter);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
