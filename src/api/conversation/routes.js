const express = require("express");
const { deleteAllConversations } = require("./controller");

const router = express.Router();

router.delete("/conversation/deleteAllConversations", deleteAllConversations);

module.exports = router;
