const express = require("express");
const { validateUserCreation, validateUserUpdate, validateUserId } = require("./validators");
const { handleValidationErrors } = require("../../errorHandler");
const { getAllUsers, createNewUser, updateUser, deleteUser } = require("./controller");

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/users", validateUserCreation, handleValidationErrors, createNewUser);
router.patch("/users/:userId", validateUserUpdate, handleValidationErrors, updateUser);
router.delete("/users/:userId", validateUserId, handleValidationErrors, deleteUser);

module.exports = router;
