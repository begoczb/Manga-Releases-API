const Favorite = require("../models/Favorite.model.js");

const isAuthorizedUser = async (req, res, next) => {
  const foundFavorite = await Favorite.findbyId(req.params.favoriteId);
  const userRef = foundFavorite.user;
  const { _id } = req.user;
  if (_id.toString() !== userRef.toString()) {
    return res.status(403).json({
      message: `You don't have permissions`,
    });
  }

  next();
};

module.exports = isAuthorizedUser;
