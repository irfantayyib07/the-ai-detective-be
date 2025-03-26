const { body } = require("express-validator");

exports.validateFileUpload = [
 (req, res, next) => {
  if (!req.file) {
   return res.status(400).json({
    success: false,
    message: "Document file is required",
    data: null,
   });
  }
  next();
 },
];

exports.validateReindexDocument = [
 body("pageId")
  .notEmpty()
  .withMessage("Page ID is required")
  .bail()
  .isString()
  .withMessage("Page ID must be a string"),
];

exports.validateChatRequest = [
 body("question")
  .notEmpty()
  .withMessage("Question is required")
  .bail()
  .isString()
  .withMessage("Question must be a string"),
 body("sourceId")
  .notEmpty()
  .withMessage("Source ID is required")
  .bail()
  .isString()
  .withMessage("Source ID must be a string"),
 body("fileName")
  .notEmpty()
  .withMessage("File name is required")
  .bail()
  .isString()
  .withMessage("File name must be a string"),
];

exports.validateFollowUpRequest = [
 body("conversationId")
  .notEmpty()
  .withMessage("Conversation ID is required")
  .bail()
  .isString()
  .withMessage("Conversation ID must be a string"),
 body("question")
  .notEmpty()
  .withMessage("Question is required")
  .bail()
  .isString()
  .withMessage("Question must be a string"),
 body("sourceId")
  .notEmpty()
  .withMessage("Source ID is required")
  .bail()
  .isString()
  .withMessage("Source ID must be a string"),
 body("fileName")
  .notEmpty()
  .withMessage("File name is required")
  .bail()
  .isString()
  .withMessage("File name must be a string"),
];
