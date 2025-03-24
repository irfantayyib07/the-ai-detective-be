const express = require("express");
const { deleteAllDocuments } = require("./controller");

const router = express.Router();

router.delete("/document/deleteAllDocuments", deleteAllDocuments);

module.exports = router;
