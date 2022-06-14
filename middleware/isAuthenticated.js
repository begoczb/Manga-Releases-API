const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user.models.js");

const isAuthenticated = async (req, res, next) => {
  const authorization = req.headers.authorization;
  console.log({ authorization });

  if (!authorization) {
    res.status(401).json({ message: "Missing Authorization header" });
    return;
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const decodedJwt = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    console.log({ decodedJwt });
    const { username } = decodedJwt;
    const user = await User.findOne({ username });
    
    req.user = user;
  } catch (error) {
    // invalid token
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  // If the user is authenticated, run next
  next();
};

module.exports = isAuthenticated;
