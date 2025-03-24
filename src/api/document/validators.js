const { body } = require("express-validator");

exports.validateRecordDocument = [
 body("sourceId").notEmpty().withMessage("Source ID is required").bail().isString(),
];
