const express = require("express");
const { validateSignup, validateLogin } = require("./validators");
const { handleValidationErrors } = require("../../errorHandler");
const { signup, login, refreshAccessToken, logout } = require("./controller");

const router = express.Router();

router.post("/auth/signup", validateSignup, handleValidationErrors, signup);
router.post("/auth/login", validateLogin, handleValidationErrors, login);
router.post("/auth/refreshAccessToken", refreshAccessToken);
router.post("/auth/logout", logout);

module.exports = router;
