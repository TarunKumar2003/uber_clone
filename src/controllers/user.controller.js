const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const { createUser } = require("../services/user.service");

async function registerUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullName, email, password } = req.body;
  const { firstName, lastName } = fullName;
  //const hashPassword = await User.hashPassword(password);

  const user = await createUser({
    firstName: firstName,
    lastName: lastName || "",
    email,
    password: password,
  });
  const token = user.generateAccessToken();
  // hide password from response
  user.password = undefined;
  res.status(201).json({ token, user });
}

// User Login Controller
async function loginInUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  // if password does not match, return error
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  // user.select("-password"); // Exclude password from the response
  user.password = undefined; // Hide password from response
  const token = user.generateAccessToken();
  res.status(200).json({ token, user });
}

module.exports = {
  registerUser,
  loginInUser,
};
