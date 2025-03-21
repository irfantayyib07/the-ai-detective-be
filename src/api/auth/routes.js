const express = require("express");
const { validateSignup, validateLogin } = require("./validators");
const { handleValidationErrors } = require("../../errorHandler");
const { signup, login, refreshAccessToken, logout } = require("./controller");
const verifyJwt = require("../../middleware/verifyJwt");

const router = express.Router();

router.post("/auth/signup", validateSignup, handleValidationErrors, signup);
router.post("/auth/login", validateLogin, handleValidationErrors, login);
router.post("/auth/refreshAccessToken", verifyJwt, refreshAccessToken);
router.post("/auth/logout", verifyJwt, logout);

module.exports = router;
