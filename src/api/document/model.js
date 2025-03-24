const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
 id: String,
});

module.exports = mongoose.model("Document", documentSchema);
