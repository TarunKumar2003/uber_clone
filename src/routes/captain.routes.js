const express = require("express");
const { body } = require("express-validator");
const { captainController } = require("../controllers");
const authCaptainMiddleware = require("../middlewares/authCaptain.middleware.js");

const captainRouter = express.Router();

captainRouter.post(
  "/register",
  [
    body("fullName.firstName")
      .isString()
      .withMessage("First name must be a string")
      .isLength({ min: 3, max: 50 })
      .withMessage("First name must be between 3 and 50 characters long"),

    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color")
      .isString()
      .withMessage("Vehicle color must be a string")
      .isLength({ min: 3 })
      .withMessage("Vehicle color must be at least 3 characters long"),
    body("vehicle.plate")
      .isString()
      .withMessage("Vehicle plate must be a string")
      .isLength({ min: 3 })
      .withMessage("Vehicle plate must be at least 3 characters long"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Vehicle capacity must be at least 1"),
    body("vehicle.vehicleType")
      .isString()
      .withMessage("Vehicle type must be a string")
      .isIn(["car", "bike", "auto"])
      .withMessage("Vehicle type must be one of: car, bike, truck"),
  ],
  captainController.registerCaptain
);
captainRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  captainController.loginInCaptain
);
// Profile Route
captainRouter.get(
  "/profile",
  authCaptainMiddleware,
  captainController.getProfile
);

// logout route
captainRouter.get("/logout", authCaptainMiddleware, captainController.logout);

module.exports = captainRouter;
