const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
 id: String,
});

module.exports = mongoose.model("Conversation", conversationSchema);
