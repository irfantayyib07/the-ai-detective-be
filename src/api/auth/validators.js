const { body, oneOf } = require("express-validator");

exports.validateSignup = [
 body("email").isEmail().withMessage("Invalid email format"),
 body("username").isString().notEmpty().withMessage("Username is required"),
 body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];

exports.validateLogin = [
 oneOf(
  [
   body("email").isEmail().withMessage("Invalid email format"),
   body("username").isString().notEmpty().withMessage("Username is required"),
  ],
  "Either email or username is required",
 ),
 body("password").isString().notEmpty().withMessage("Password is required"),
];
