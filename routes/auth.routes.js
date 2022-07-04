const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User.model.js");

const router = require("express").Router();
const saltRounds = 10;

/*
  POST /signup
  Create a user
*/
router.post("/signup", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res
        .status(401)
        .json({ message: "Username already exists. Try logging in instead." });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log({ hashedPassword });

    const createdUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Loging
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    res.status(404).json({ message: "username does not exist" });
    return;
  }
  const isPasswordMatched = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordMatched) {
    res.status(401).json({ message: "Wrong password!" });
    return;
  }
  const payload = { username };

  const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "3h",
  });

  res.status(200).json({
    message: `Welcome ${username}`,
    authToken,
  });
});

router.get("/verify", async (req, res, next) => {
  const { authorization } = req.headers;


  const token = authorization.replace("Bearer ", "");
  console.log({ token });

  try {
    const payload = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    console.log({ payload });

    res.json({ token, payload });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid token" });
  }
});

module.exports = router;
