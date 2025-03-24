const Document = require("./model");
const { deleteDocument } = require("./services");

const recordDocument = async (req, res) => {
 try {
  const { sourceId } = req.body;
  const document = await Document.create({ id: sourceId });
  res.status(200).json({
   success: true,
   message: "Document created successfully",
   data: document,
  });
 } catch (error) {
  res.status(500).json({
   success: false,
   message: "Server error",
   error: error.message,
  });
 }
};

const deleteAllDocuments = async (req, res) => {
 try {
  const documents = await Document.find();

  if (!documents.length) {
   return res.status(404).json({
    success: false,
    message: "No documents found",
    data: null,
   });
  }

  const results = await Promise.allSettled(
   documents.map(async doc => {
    try {
     await deleteDocument(doc.id);
     return { id: doc.id, success: true };
    } catch (error) {
     return {
      id: doc.id,
      success: false,
      error: error.message,
     };
    }
   }),
  );

  const failures = results.filter(result => result.value && result.value.success === false);

  await Document.deleteMany({});

  if (failures.length) {
   return res.status(207).json({
    success: true,
    message: `Documents deleted from database, but ${failures.length} network requests failed`,
    data: {
     totalDocuments: documents.length,
     failedRequests: failures.map(f => f.value),
    },
   });
  }

  return res.status(200).json({
   success: true,
   message: "All documents deleted successfully",
   data: null,
  });
 } catch (error) {
  return res.status(500).json({
   success: false,
   message: "Server error",
   error: error.message,
  });
 }
};

module.exports = { recordDocument, deleteAllDocuments };
