const express = require("express");
const router = express.Router();
const authRoutes = require("./auth/routes");
const userRoutes = require("./user/routes");
const chatRoutes = require("./chat/routes");

router.use(authRoutes);
router.use(userRoutes);
router.use(chatRoutes);

module.exports = router;
