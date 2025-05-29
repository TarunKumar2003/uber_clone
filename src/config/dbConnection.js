const mongoose = require("mongoose");
const serverConfig = require("./serverConfig");

function connectToDb() {
  mongoose.connect(serverConfig.MONGO_URI);
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });
  mongoose.connection.on("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
  });
}

module.exports = connectToDb;
