const { body, param } = require("express-validator");

// For /analyze endpoint with multipart form data
exports.validateChatRequest = [
 // Validate 'question' field in form data
 body("question").isString().notEmpty().withMessage("Question is required"),

 // Add file validation through a custom middleware
 // This needs to come after the multer middleware in the route chain
 (req, res, next) => {
  if (!req.file) {
   return res.status(400).json({
    errors: [{ msg: "Document file is required", param: "document" }],
   });
  }

  // const allowedTypes = [
  //  "application/pdf",
  //  "text/plain",
  //  "application/msword",
  //  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // ];

  // if (!allowedTypes.includes(req.file.mimetype)) {
  //  return res.status(400).json({
  //   errors: [
  //    {
  //     msg: "Invalid file type. Supported formats: PDF, TXT, DOC, DOCX",
  //     param: "document",
  //    },
  //   ],
  //  });
  // }

  next();
 },
];

// For /follow-up endpoint
exports.validateFollowUpRequest = [
 body("conversationId").isString().notEmpty().withMessage("Conversation ID is required"),
 body("question").isString().notEmpty().withMessage("Question is required"),
 body("sourceId").isString().withMessage("Source ID must be a string"),
];
