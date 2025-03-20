const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDb = require("../services/connectDb");
const { handleGeneralErrors } = require("../errorHandler");
const appRoutes = require("../app");
const { default: mongoose } = require("mongoose");

const app = express();
const port = process.env.PORT || 3500;

connectDb();

// Middleware
app.use(cors());
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
 app.listen(port, () => console.log(`Server running on port ${port}`));
});

mongoose.connection.on("error", err => {
 console.log(err);
 // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});
