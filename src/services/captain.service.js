const Captain = require("../models/captain.model");

async function createCaptain({
  firstName,
  lastName,
  email,
  password,
  plate,
  color,
  capacity,
  vehicleType,
}) {
  if (
    !firstName ||
    !email ||
    !password ||
    !plate ||
    !color ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("All fields are required");
  }

  // Here you would typically hash the password and save the captain to the database
  const hashedPassword = await Captain.hashPassword(password);
  const captain = Captain.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashedPassword,
    vehicle: {
      plate,
      color,
      capacity,
      vehicleType,
    },
  });
  return captain;
}

module.exports = { createCaptain };
