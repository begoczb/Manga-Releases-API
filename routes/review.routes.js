const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const isAuthorizedUser = require("../middleware/isAuthorizedUser");
const Review = require("../models/Review.model");
const { isValidObjectId } = require("mongoose");
const MangaSeries = require("../models/MangaSeries.model.js");

// Get all Reviews from User:
router.get("/user", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const foundReviews = await Review.find({ user: _id }).populate("series", {
      name: 1,
      authors: 1,
    });
    res.status(200).json(foundReviews);
  } catch (err) {
    next(err);
  }
});

//Get all Reviews for a Series
router.get("/series", async (req, res, next) => {
  try {
    const { seriesId } = req.body;
    const foundReviews = await Review.find({ series: seriesId }).populate(
      "user",
      {
        username: 1,
        picture: 1,
      }
    );
    res.status(200).json(foundReviews);
  } catch (err) {
    next(err);
  }
});

//Get One Review
router.get("/single/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: 'Please provide a valid object id for "review".',
      });
      return;
    }

    const foundOneReview = await Review.findById(id).populate("series", {
      name: 1,
      authors: 1,
      _id: 0,
    });
    res.status(200).json(foundOneReview);
  } catch (err) {
    next(err);
  }
});

//Create a Review
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    let { series } = req.body;
    const user = req.user._id;
    const rating = req.body;
    const textContent = req.body;

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
    const foundReview = await Review.find({
      $and: [{ series: series }, { user: user }],
    });
    if (foundReview.length != 0) {
      res
        .status(409)
        .json({ message: `You already have reviewed this series` });
      return;
    }

    const newReview = await Review.create({
      user,
      series,
      rating,
      textContent,
    });

    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
});

//Update a Review by its id
router.patch(
  "/:reviewId",
  isAuthenticated,
  isAuthorizedUser,
  async (req, res, next) => {
    try {
      const id = req.params.reviewId;
      const { rating, textContent } = req.body;
      if (!isValidObjectId(id)) {
        res.status(400).json({
          message: 'Please provide a valid object id for "review".',
        });
        return;
      }
      const review = await Review.findById(id);
      const updatedReview = await Review.findByIdAndUpdate(
        id,
        {
          ...review,
          rating,
          textContent,
        },
        { new: true }
      );
      res.status(200).json(updatedReview);
    } catch (error) {
      next(error);
    }
  }
);

//Delete a Review by id
router.delete(
  "/:reviewId",
  isAuthenticated,
  isAuthorizedUser,
  async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.reviewId)) {
        res.status(400).json({
          message: 'Please provide a valid object id for "review".',
        });
        return;
      }
      await Review.findByIdAndDelete(req.params.reviewId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
