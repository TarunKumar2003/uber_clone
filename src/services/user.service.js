const User = require("../models/userModel");

async function createUser({ firstName, lastName, email, password }) {
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }
  try {
    const user = await User.create({
      fullName: {
        firstName,
        lastName: lastName || "",
      },
      email,
      password,
    });
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
}

module.exports = {
  createUser,
};
