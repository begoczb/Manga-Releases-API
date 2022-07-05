const Review = require("../models/Review.model.js");

const isPosterOfReview = async (req, res, next) => {
  try {
    const foundReview = await Review.findById(req.params.reviewId);
    const userRef = foundReview.user;
    const { _id } = req.user;
    if (_id.toString() !== userRef.toString()) {
      return res.status(403).json({
        message: `You don't have permissions`,
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isPosterOfReview;
