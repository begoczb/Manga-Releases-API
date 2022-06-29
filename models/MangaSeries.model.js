const { Schema, model, SchemaTypes } = require("mongoose");

const mangaSeriesSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    authors: [String],
    synopsis: String,
    genres: [String],
    publisher: String,
    language: {
      enum: ["en", "es", "fr"],
    },
  },

  {
    timestamp: true,
  }
);

const MangaSeries = model("MangaSeries", mangaSeriesSchema);

module.exports = MangaSeries;
