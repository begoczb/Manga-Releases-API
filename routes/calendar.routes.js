const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const isAuthorizedUser = require("../middleware/isAuthorizedUser");
const Favorite = require("../models/Favorite.model.js");
const { isValidObjectId } = require("mongoose");
const MangaVolume = require("../models/MangaVolume.model.js");

//Get User Favorites latest volumes

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.user;
    let latestVolumes = [];
    const foundFavorites = await Favorite.find({ user: _id });
    for (let i = 0; i < foundFavorites.length; i++) {
      const { series } = foundFavorites[i];
      const foundVolume = await MangaVolume.findOne({ series: series }).sort({
        number: -1,
      });

      latestVolumes.push(foundVolume);
    }

    latestVolumes.sort((a, b) => a.releaseDate - b.releaseDate);
    res.status(200).json(latestVolumes);
  } catch (err) {
    next(err);
  }
});

//Read Month Releases
// router.get("/:month", isAuthenticated, async (req, res, next) => {
//   try {
//     const { _id } = req.user;
//     let latestVolumes = [];
//     const foundFavorites = await Favorite.find({ user: _id });
//     for (let i = 0; i < foundFavorites.length; i++) {
//       const { series } = foundFavorites[i];
//       const foundVolume = await MangaVolume.findOne({ series: series }).sort({
//         number: -1,
//       });

//       latestVolumes.push(foundVolume);
//     }

//     latestVolumes.sort((a, b) => a.releaseDate - b.releaseDate);
//     filteredVolumes = latestVolumes.filter;

//     res.status(200).json(latestVolumes);
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
