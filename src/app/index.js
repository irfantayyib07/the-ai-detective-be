const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { corsConfig } = require("../config/cors");
const cookieParser = require("cookie-parser");
const connectDb = require("../services/connect-db");
const { handleGeneralErrors } = require("../errorHandler");
const appRoutes = require("../api");
const { default: mongoose } = require("mongoose");

const app = express();
const port = process.env.PORT || 3500;

connectDb();

// Middleware
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (_, res) => {
 res.send("AI Detective Backend Here!");
});

app.use(appRoutes);

app.all("*", (req, res) => {
 res.status(404).json({ message: "404 Not Found" });
});

// Error Handling
app.use(handleGeneralErrors);

mongoose.connection.once("open", () => {
 console.log("Connected to MongoDB");
 if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
 }
});

mongoose.connection.on("error", err => {
 console.log(err);
 // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});

module.exports = app;
