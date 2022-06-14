const { Schema, model, SchemaTypes } = require("mongoose");

const mangaVolumeSchema = new Schema({
  series: {
    type: SchemaTypes.ObjectId,
    ref: "MangaSeries",
  },
  title: { type: String, unique: true },
  ISBN: String,
  number: Number,
  releaseDate: Date,
  cover: String,
});

const MangaVolume = model("MangaVolume", mangaVolumeSchema);

module.exports = MangaVolume;
