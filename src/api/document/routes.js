const express = require("express");
const { recordDocument, deleteAllDocuments } = require("./controller");
const { validateRecordDocument } = require("./validators");
const { handleValidationErrors } = require("../../errorHandler");

const router = express.Router();

router.post("/document/recordDocument", validateRecordDocument, handleValidationErrors, recordDocument);
router.delete("/document/deleteAllDocuments", deleteAllDocuments);

module.exports = router;
