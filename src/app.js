const express = require("express");
const connectToDb = require("./config/dbConnection");
const app = express();

connectToDb();
module.exports = app;
