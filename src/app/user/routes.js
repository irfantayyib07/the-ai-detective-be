const express = require("express");
const { validateUserCreation, validateUserUpdate, validateUserId } = require("./validators");
const { handleValidationErrors } = require("../../errorHandler");
const { getAllUsers, createNewUser, updateUser, deleteUser } = require("./controller");
const verifyJwt = require("../../middleware/verifyJwt");

const router = express.Router();

router.use(verifyJwt);

router.get("/user/getAllUsers", getAllUsers);
router.post("/user/createNewUser", validateUserCreation, handleValidationErrors, createNewUser);
router.patch("/user/updateUser/:userId", validateUserUpdate, handleValidationErrors, updateUser);
router.delete("/user/deleteUser/:userId", validateUserId, handleValidationErrors, deleteUser);

module.exports = router;
