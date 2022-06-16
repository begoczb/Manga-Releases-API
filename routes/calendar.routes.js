const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const isAuthorizedUser = require("../middleware/isAuthorizedUser");
const Favorite = require("../models/Favorite.model.js");
const { isValidObjectId } = require("mongoose");
const MangaVolume = require("../models/MangaVolume.model.js");

//Get User Favorites latest volumes

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.user;
    let latestVolumes = [];
    const foundFavorites = await Favorite.find({ user: _id });
    for (let i = 0; i < foundFavorites.length; i++) {
      const { series } = foundFavorites[i];
      const foundVolume = await MangaVolume.findOne({ series: series }).sort({
        number: -1,
      });

      latestVolumes.push(foundVolume);
    }

    if (latestVolumes.length === 0) {
      res.sendStatus(404);
      return;
    }
    latestVolumes.sort((a, b) => a.releaseDate - b.releaseDate);
    res.status(200).json(latestVolumes);
  } catch (err) {
    next(err);
  }
});

// Read Month Releases
router.get("/:year/:month", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.user;
    let latestVolumes = [];
    const { year, month } = req.params;

    const foundFavorites = await Favorite.find({ user: _id });
    for (let i = 0; i < foundFavorites.length; i++) {
      const { series } = foundFavorites[i];
      if (year && month) {
        const foundVolume = await MangaVolume.findOne({
          $and: [
            { series: series },
            {
              releaseDate: {
                $gte: new Date(`${year}/${month}/01`),
                $lte: new Date(`${year}/${month}/31`),
              },
            },
          ],
        }).sort({
          number: 1,
        });

        if (foundVolume) {
          latestVolumes.push(foundVolume);
        }
      } else {
        res
          .status(400)
          .json({ message: `Please make sure you put a valid year and month` });
        return;
      }
    }

    if (latestVolumes.length === 0) {
      res.sendStatus(404);
      return;
    }

    latestVolumes.sort((a, b) => a.releaseDate - b.releaseDate);
    res.status(200).json(latestVolumes);
  } catch (err) {
    next(err);
  }
});

router.get("/:year", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.user;
    let latestVolumes = [];
    const { year } = req.params;

    const foundFavorites = await Favorite.find({ user: _id });
    for (let i = 0; i < foundFavorites.length; i++) {
      const { series } = foundFavorites[i];
      if (year) {
        const foundVolume = await MangaVolume.findOne({
          $and: [
            { series: series },
            {
              releaseDate: {
                $gte: new Date(`${year}/01/01`),
                $lte: new Date(`${year}/12/31`),
              },
            },
          ],
        }).sort({
          number: 1,
        });

        if (foundVolume) {
          latestVolumes.push(foundVolume);
        }
      } else {
        res
          .status(400)
          .json({ message: `Please make sure you put a valid year` });
        return;
      }
    }

    if (latestVolumes.length === 0) {
      res.sendStatus(404);
      return;
    }
    latestVolumes.sort((a, b) => a.releaseDate - b.releaseDate);

    res.status(200).json(latestVolumes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
