const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const Review = require("../models/Review.model");
const MangaVolume = require("../models/MangaVolume.model");
const { isValidObjectId } = require("mongoose");
const MangaSeries = require("../models/MangaSeries.model.js");
const isPosterOfReview = require("../middleware/isPosterOfReview");
const User = require("../models/User.model");

// Get all Reviews from User:
router.get("/user", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.user;

    const foundReviews = await Review.find({ user: _id })
      .populate("series", {
        name: 1,
        authors: 1,
      })
      .populate("user", {
        username: 1,
        picture: 1,
      });

    let allCovers = foundReviews.map(async (review) => {
      const coverImg = await MangaVolume.find({ series: review.series._id })
        .sort({ number: 1 })
        .limit(1);

      if (!coverImg[0]) {
        coverImg[0] = { cover: "no image" };
      }
      // console.log(coverImg[0].cover);

      return coverImg[0].cover;
    });

    const allPromises = await Promise.all(allCovers);
    res.status(200).json({ foundReviews, allPromises });
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
    const rating = parseInt(req.body.rating);
    const { textContent } = req.body;

    // if (!isValidObjectId(series)) {
    //   const foundSeries = await MangaSeries.findOne({
    //     name: { $regex: new RegExp(series, "i") },
    //   });
    //   if (foundSeries) {
    //     series = foundSeries._id;
    //   } else {
    //     res.status(400).json({
    //       message:
    //         'Please provide a valid object id for "series" or an existing series name.',
    //     });
    //     return;
    //   }
    // }
    // const foundReview = await Review.find({
    //   $and: [{ series: series }, { user: user }],
    // });
    // if (foundReview.length != 0) {
    //   res
    //     .status(409)
    //     .json({ message: `You already have reviewed this series` });
    //   return;
    // }

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
  isPosterOfReview,
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
  isPosterOfReview,
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
