const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
  return res.status(400).json({
   success: false,
   message: "Validation failed",
   data: errors.array(),
  });
 }
 next();
};

const handleGeneralErrors = (err, req, res, next) => {
 console.error(err);
 res.status(err.status || 500).json({
  success: true,
  message: err.message || "Internal Server Error",
  data: null,
 });
};

module.exports = { handleValidationErrors, handleGeneralErrors };
