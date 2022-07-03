const { Schema, model, SchemaTypes } = require("mongoose");

const reviewSchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
    series: {
      type: SchemaTypes.ObjectId,
      ref: "MangaSeries",
    },
    rating: Number,
    textContent: String,
  },
  {
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);
module.exports = Review;
