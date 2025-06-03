const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

async function registerCaptain(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log(req.body);

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

module.exports = {
  registerCaptain,
};
