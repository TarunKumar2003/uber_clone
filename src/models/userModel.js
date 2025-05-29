const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters long"],
      maxLength: [50, "First name must not exceed 50 characters"],
    },
    lastName: {
      type: String,
      minLength: [3, "Last name must be at least 3 characters long"],
      maxLength: [50, "Last name must not exceed 50 characters"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Exclude password from queries by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  socketId: {
    type: String,
  },
});

userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

userSchema.methods.hashPassword = async function () {
  return bcrypt.hash(this.password, 10);
};
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
