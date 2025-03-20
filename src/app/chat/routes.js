const express = require("express");
const upload = require("../../config/multer");
const { validateFileUpload, validateChatRequest, validateFollowUpRequest } = require("./validators");
const { handleValidationErrors } = require("../../errorHandler");
const { uploadDocument, analyzeDocument, followUpQuestion } = require("./controller");

const router = express.Router();

router.post(
 "/chat/uploadDocument",
 upload.single("document"),
 validateFileUpload,
 handleValidationErrors,
 uploadDocument,
);
router.post(
 "/chat/analyzeDocument",
 // upload.single("document"),
 validateChatRequest,
 handleValidationErrors,
 analyzeDocument,
);
router.post("/chat/followUpQuestion", validateFollowUpRequest, handleValidationErrors, followUpQuestion);

module.exports = router;
