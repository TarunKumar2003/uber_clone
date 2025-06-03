const jwt = require("jsonwebtoken");
const serverConfig = require("../config/serverConfig");
const Captain = require("../models/captain.model");

async function authCaptainMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, serverConfig.JWT_SECRET);

    const captain = await Captain.findById(decoded.id); // Not decoded._id

    if (!captain) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Captain not found" });
    }

    req.captain = captain;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

module.exports = authCaptainMiddleware;
