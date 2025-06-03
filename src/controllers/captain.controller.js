const Captain = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const BlackList = require("../models/blackListModel");

// Register Captain Controller
async function registerCaptain(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Just check for existing captain by email
    const existingCaptain = await Captain.findOne({ email: req.body.email });
    if (existingCaptain) {
      return res
        .status(400)
        .json({ error: "Captain with this email already exists" });
    }
    const captain = await captainService.createCaptain({
      firstName: req.body.fullName.firstName,
      lastName: req.body.fullName.lastName || "",
      email: req.body.email,
      password: req.body.password,
      plate: req.body.vehicle.plate,
      color: req.body.vehicle.color,
      capacity: req.body.vehicle.capacity,
      vehicleType: req.body.vehicle.vehicleType,
    });

    const token = captain.generateAccessToken();
    // Hide password from response
    return res
      .status(201)
      .json({ captain: { ...captain.toObject(), password: undefined }, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// loginIn Captain Controller

async function loginInCaptain(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await Captain.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAccessToken(); // Make sure this method exists

  // Convert to plain object and remove password
  const captainData = captain.toObject();
  delete captainData.password;

  res.cookie("token", token); // optional
  res.status(200).json({ token, captain: captainData });
}

// Get captain Profile
async function getProfile(req, res) {
  return res.status(200).json({
    captain: req.captain,
  });
}

async function logout(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  // first blacklisted the token
  const blackListedToken = await BlackList.create({ token });
  if (!blackListedToken) {
    return res.status(500).json({ message: "Failed to log out" });
  }
  // then clear the cookie
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successfully" });
}
module.exports = {
  registerCaptain,
  loginInCaptain,
  getProfile,
  logout,
};
