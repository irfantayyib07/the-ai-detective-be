const { body, param } = require("express-validator");

exports.validateUserCreation = [
 body("email").isEmail().withMessage("Invalid email format"),
 body("username").isString().notEmpty().withMessage("Username is required"),
 body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

exports.validateUserUpdate = [
 param("userId").isMongoId().withMessage("Invalid user ID"),
 body("email").isEmail().withMessage("Invalid email format"),
 body("username").isString().notEmpty().withMessage("Username is required"),
 body("active").optional().isBoolean().withMessage("Active status must be true or false"),
 body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

exports.validateUserId = [param("userId").isMongoId().withMessage("Invalid user ID")];
