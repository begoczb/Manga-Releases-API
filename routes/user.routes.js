const router = require("express").Router();
const User = require("../models/User.model.js");

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
