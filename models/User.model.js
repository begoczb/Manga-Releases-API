const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: String,
    settings: {
      mode: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      nsfw: {
        type: Boolean,
        default: false,
      },
      lang: {
        type: String,
        enum: ["en", "es", "fr"],
        default: "en",
      },
      
    },
  },

  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
