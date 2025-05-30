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
  const hashPassword = await User.hashPassword(password);

  const user = await createUser({
    firstName: firstName,
    lastName: lastName || "",
    email,
    password: hashPassword,
  });
  const token = user.generateAccessToken();

  res.status(201).json({ token, user });
}

module.exports = {
  registerUser,
};
