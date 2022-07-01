const router = require("express").Router();
const User = require("../models/User.model.js");
const isAuthenticated = require("../middleware/isAuthenticated");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const Review = require("../models/Review.model");
const Favorite = require("../models/Favorite.model");

const uploader = require("../config/cloudinary.config.js");

router.patch(
  "/me",
  isAuthenticated,
  uploader.single("picture"),
  async (req, res, next) => {
    try {
      const { username, email, password, settings } = req.body;
      const userUpdatedFields = {};

      if (req.file) {
        userUpdatedFields.picture = req.file.path;
      }

      if (password) {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        userUpdatedFields.password = hashedPassword;
      }

      if (email) {
        userUpdatedFields.email = email;
      }
      if (settings) {
        userUpdatedFields.settings = { ...req.user.settings, ...settings };
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        userUpdatedFields,
        {
          new: true,
        }
      );

      const payload = { username: updatedUser.username };

      const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "3h",
      });

      res.status(200).json({
        message: `Good job, ${updatedUser.username} you updated your profil`,
        authToken,
        updatedUser: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get user's profile
router.get("/profile/:username", isAuthenticated, async (req, res, next) => {
  try {
    const { username } = req.params;
    const { _id, picture } = await User.findOne({ username }).select("picture");
    const reviews = await Review.find({ user: _id });
    const favorites = await Favorite.fin({ user: _id });
    res.status(200).json({ username, picture, reviews, favorites });
  } catch (err) {
    next(err);
  }
});

// Get user info (for editing)
router.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    const { username, email, picture, _id, settings } = req.user;
    const reviews = await Review.find({ user: _id });
    const favorites = await Favorite.find({ user: _id });
    res
      .status(200)
      .json({ username, email, picture, reviews, favorites, settings });
  } catch (err) {
    next(err);
  }
});

// Get user's settings
router.get("/settings", isAuthenticated, async (req, res, next) => {
  try {
    const { settings } = req.user;
    res.status(200).json({ settings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
