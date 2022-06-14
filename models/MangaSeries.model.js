const { Schema, model, SchemaTypes } = require("mongoose");

const mangaSeriesSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  authors: [String],
  synopsis: String,
  genre: [String],
  publisher: String,
  cover: String,
});

const MangaSeries = model("MangaSeries", mangaSeriesSchema);

module.exports = MangaSeries;
