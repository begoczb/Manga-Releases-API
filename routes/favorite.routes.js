const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const isAuthorizedUser = require("../middleware/isAuthorizedUser");
const Favorite = require("../models/Favorite.model.js");
const { isValidObjectId } = require("mongoose");
const MangaSeries = require("../models/MangaSeries.model.js");

// Get all Favorites from User:
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const foundFavorites = await Favorite.find({ user: _id }).populate(
      "series",
      { name: 1, authors: 1, _id: 0 }
    );
    res.status(200).json(foundFavorites);
  } catch (err) {
    next(err);
  }
});

//Get One Favorite
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: 'Please provide a valid object id for "favorite".',
      });
      return;
    }

    const foundOneFavorite = await Favorite.findById(id).populate("series", {
      name: 1,
      authors: 1,
      _id: 0,
    });
    res.status(200).json(foundOneFavorite);
  } catch (err) {
    next(err);
  }
});

//Create a Favorite
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    let { series } = req.body;
    const user = req.user._id;

    if (!isValidObjectId(series)) {
      const foundSeries = await MangaSeries.findOne({
        name: { $regex: new RegExp(series, "i") },
      });
      if (foundSeries) {
        series = foundSeries._id;
      } else {
        res.status(400).json({
          message:
            'Please provide a valid object id for "series" or an existing series name.',
        });
        return;
      }
    }
    const foundFavorite = await Favorite.find({
      $and: [{ series: series }, { user: user }],
    });
    if (foundFavorite.length != 0) {
      res
        .status(409)
        .json({ message: `You already have this series as favorite` });
      return;
    }

    const { _id } = await Favorite.create({
      user,
      series,
    });
    const populatedFavorite = await Favorite.findById(_id).populate(
      "user series",
      { username: 1, name: 1, authors: 1, _id: 0 }
    );

    res.status(201).json(populatedFavorite);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:favoriteId",
  isAuthenticated,
  isAuthorizedUser,
  async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.favoriteId)) {
        res.status(400).json({
          message: 'Please provide a valid object id for "favorite".',
        });
        return;
      }
      await Favorite.findByIdAndDelete(req.params.favoriteId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
