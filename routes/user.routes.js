const router = require("express").Router();
const User = require("../models/User.model.js");
const isAuthenticated = require("../middleware/isAuthenticated");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const uploader = require("../config/cloudinary.config.js");

router.patch(
  "/",
  isAuthenticated,
  uploader.single("picture"),
  async (req, res, next) => {
    try {
      // const { _id } = req.user;

      const { username } = req.body;

      if (req.file) {
        req.body.picture = req.file.path;
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
      }

      await User.findByIdAndUpdate(req.user, req.body);

      const payload = { username };

      const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "3h",
      });

      res.status(200).json({
        message: `Good job, ${username} you updated your profil`,
        authToken,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get user's profile
router.get("/:username", isAuthenticated, async (req, res, next) => {
  try {
    const { username } = req.params;
    const { _id, picture } = await User.findOne({ username }).select("picture");
    const reviews = await Review.find({ user: _id });
    res.status(200).json({ username, picture, reviews });
  } catch (err) {
    next(err);
  }
});

// Get user info (for editing)
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const { username, email, picture } = req.user;
    res.status(200).json({ username, email, picture });
  } catch (err) {
    next(err);
  }
});

// Get user's settings
router.get("/settings/", isAuthenticated, async (req, res, next) => {
  try {
    const { settings } = req.user;
    res.status(200).json({settings});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
