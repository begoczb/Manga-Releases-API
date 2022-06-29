const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique : true,
      required : true, 
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required : true,
    },
    picture: String,
    settings: {
      mode: {
        enum: ["light", "dark"],
      },
      nsfw: false,
    },
  },

  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
