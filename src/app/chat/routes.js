const express = require("express");
const upload = require("../../config/multer");
const { validateFileUpload, validateChatRequest, validateFollowUpRequest } = require("./validators");
const { handleValidationErrors } = require("../../errorHandler");
const { uploadDocument, analyzeDocument, followUpQuestion } = require("./controller");

const router = express.Router();

router.post(
 "/chat/upload-source",
 upload.single("document"),
 validateFileUpload,
 handleValidationErrors,
 uploadDocument,
);
router.post(
 "/chat/analyze",
 // upload.single("document"),
 validateChatRequest,
 handleValidationErrors,
 analyzeDocument,
);
router.post("/chat/follow-up", validateFollowUpRequest, handleValidationErrors, followUpQuestion);

module.exports = router;
