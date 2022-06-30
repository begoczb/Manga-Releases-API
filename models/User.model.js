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
    picture: {
      type: String,
      default: "https://i.pinimg.com/474x/8f/1b/09/8f1b09269d8df868039a5f9db169a772.jpg"
    },
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
