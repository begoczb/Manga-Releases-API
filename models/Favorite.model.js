const { Schema, model, SchemaTypes } = require("mongoose");

const favoriteSchema = new Schema({
  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  series: {
    type: SchemaTypes.ObjectId,
    ref: "MangaSeries",
  },
});

const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
