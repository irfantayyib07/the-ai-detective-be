const express = require("express");
const upload = require("../../config/multer");
const { validateChatRequest, validateFollowUpRequest } = require("./validators");
const { handleValidationErrors } = require("../../errorHandler");
const { analyzeDocument, followUpQuestion } = require("./controller");

const router = express.Router();

router.post(
 "/chat/analyze",
 upload.single("document"),
 validateChatRequest,
 handleValidationErrors,
 analyzeDocument,
);
router.post("/chat/follow-up", validateFollowUpRequest, handleValidationErrors, followUpQuestion);

module.exports = router;
