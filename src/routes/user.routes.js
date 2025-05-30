const express = require("express");
const { body, validationResult } = require("express-validator");
const { userController } = require("../controllers");
const userRouter = express.Router();

userRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("fullName.firstName")
      .isLength({ min: 3, max: 50 })
      .withMessage("First name must be between 3 and 50 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.registerUser
);
userRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginInUser
);
module.exports = userRouter;
