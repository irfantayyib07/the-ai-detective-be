const express = require("express");
const upload = require("../../config/multer");
const {
 validateFileUpload,
 validateReindexDocument,
 validateChatRequest,
 validateFollowUpRequest,
} = require("./validators");
const { handleValidationErrors } = require("../../errorHandler");
const { uploadDocument, analyzeDocument, followUpQuestion, reindexDocument } = require("./controller");

const router = express.Router();

router.post(
 "/chat/uploadDocument",
 upload.single("document"),
 validateFileUpload,
 handleValidationErrors,
 uploadDocument,
);
router.post("/chat/reindexDocument", validateReindexDocument, handleValidationErrors, reindexDocument);
router.post("/chat/analyzeDocument", validateChatRequest, handleValidationErrors, analyzeDocument);
router.post("/chat/followUpQuestion", validateFollowUpRequest, handleValidationErrors, followUpQuestion);

module.exports = router;
