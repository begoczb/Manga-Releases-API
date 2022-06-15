const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)
router.use("/mangaSeries", require("./mangaSeries.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/mangaVolume", require("./mangaVolume.routes"));
router.use("/favorite", require("./favorite.routes"));
router.use("/calendar", require("./calendar.routes"));

module.exports = router;
