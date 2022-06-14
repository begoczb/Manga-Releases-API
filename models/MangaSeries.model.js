const { Schema, model, SchemaTypes } = require("mongoose");

const mangaSeriesSchema = new Schema({
  name: String,
  authors: [String],
  synopsis: String,
  genres: [String],
  publisher: String,
  cover: String,
});

const MangaSeries = model("MangaSeries", mangaSerieSchema);

module.exports = MangaSeries;
