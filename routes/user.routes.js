const router = require("express").Router();
const User = require("../models/User.model.js");
const isAuthenticated = require("../middleware/isAuthenticated");

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

// Post upload picture
// need is Authenticated and the DB here
router.post(
  "/upload",
  isAuthenticated,
  uploader.single("picture"),
  async (req, res, next) => {
    try {
      if (req.file) {
        req.body.url = req.file.path;
        await User.findByIdAndUpdate(req.user._id, { picture: req.file.path });
      }
      res.status(201).json(req.body.url);
    } catch (err) {
      next(err);
    }
  }
);

router.patch('/edit', isAuthenticated, )

// Get user's settings
router.get("/settings/:username", async (req, res, next) => {
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
