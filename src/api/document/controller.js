const Document = require("./model");
const { deleteDocument } = require("./services");

const deleteAllDocuments = async (req, res) => {
 try {
  const documents = await Document.find();

  if (!documents.length) {
   return res.status(404).json({ success: false, message: "No documents found", data: null });
  }

  await Promise.all(documents.map(convo => deleteDocument(convo.id)));

  await Document.deleteMany({});

  res.status(200).json({
   success: true,
   message: "All documents deleted successfully",
   data: null,
  });
 } catch (error) {
  res.status(500).json({
   success: false,
   message: "Server error",
   error: error.message,
  });
 }
};

module.exports = { deleteAllDocuments };
