const { body, oneOf } = require("express-validator");

exports.validateSignup = [
 body("email")
  .notEmpty()
  .withMessage("Email is required")
  .bail()
  .isEmail()
  .withMessage("Invalid email format"),
 body("username")
  .notEmpty()
  .withMessage("Username is required")
  .bail()
  .isString()
  .withMessage("Username must be a string"),
 body("password")
  .notEmpty()
  .withMessage("Password is required")
  .bail()
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long"),
];

exports.validateLogin = [
 oneOf(
  [
   body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
   body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isString()
    .withMessage("Username must be a string"),
  ],
  "Either email or username is required",
 ),
 body("password")
  .notEmpty()
  .withMessage("Password is required")
  .bail()
  .isString()
  .withMessage("Password must be a string"),
];
