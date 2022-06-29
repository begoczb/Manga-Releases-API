const router = require("express").Router();
const User = require("../models/User.model.js");

const fileUploader = require("../config/cloudinary.config.js");

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
router.post("/upload", fileUploader.single("picture"), (req, res, next) => {
  if (req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  res.json({ fileUrl: req.file.path });
});

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
