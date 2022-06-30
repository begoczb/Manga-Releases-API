const router = require("express").Router();
const User = require("../models/User.model.js");
const isAuthenticated = require("../middleware/isAuthenticated");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const uploader = require("../config/cloudinary.config.js");

//Get all users
router.get("/", async (req, res, next) => {
  try {
    const foundUsers = await User.find();
    if (foundUsers.length === 0) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(foundUsers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

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
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    let userInfo = await User.findById(req.params.id);

    res.status(200).json(userInfo);
  } catch (err) {
    next(err);
  }
});

// Get user's settings
router.get("/settings/:username", isAuthenticated, async (req, res, next) => {
  try {
    const { username } = req.params;
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      res.status(404).json({ message: "username does not exist" });
      return;
    }

    const { settings } = foundUser;
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
});
