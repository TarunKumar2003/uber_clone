const jwt = require("jsonwebtoken");
const serverConfig = require("../config/serverConfig");
const User = require("../models/userModel");

async function authMiddleware(req, res, next) {
  // What we do here
  // First take token from req cookies or header
  // if token is valid so find the verify the token and fetch the user based on this ID we made token
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
    const user = await User.findById(decoded._id);
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authMiddleware;
