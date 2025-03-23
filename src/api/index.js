const express = require("express");
const router = express.Router();
const verifyJwt = require("../middleware/verify-jwt");
const authRoutes = require("./auth/routes");
const userRoutes = require("./user/routes");
const chatRoutes = require("./chat/routes");

// Public or Partially Protected Routes
router.use(authRoutes);

// Totally Protected Routes
// router.use(verifyJwt);
router.use(userRoutes);
router.use(chatRoutes);

module.exports = router;
