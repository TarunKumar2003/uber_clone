const express = require("express");
const connectToDb = require("./config/dbConnection");
const userRouter = require("./routes/user.routes");
const app = express();

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);
module.exports = app;
