const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
 documents: [{ id: String }],
});

module.exports = mongoose.model("Document", documentSchema);
