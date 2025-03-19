const {
 uploadDocumentSource,
 createConversation,
 sendMessageWithSourceReference,
 sendFollowUpMessage,
} = require("./services");

const uploadDocument = async (req, res) => {
 try {
  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;

  const sourceId = await uploadDocumentSource(fileBuffer, fileName);

  res.status(200).json({
   success: true,
   sourceId: sourceId,
   message: "Document uploaded successfully",
  });
 } catch (error) {
  console.error("Document upload error:", error);
  res.status(500).json({
   success: false,
   error: `An error occurred during document upload: ${error.message}`,
  });
 }
};

const analyzeDocument = async (req, res) => {
 try {
  const question = req.body.question;
  const sourceId = req.body.sourceId;

  // const fileBuffer = req.file.buffer;
  // const fileName = req.file.originalname;

  // const sourceId = await uploadDocumentSource(fileBuffer, fileName);
  const sessionId = await createConversation();
  const analysisResult = await sendMessageWithSourceReference(sessionId, sourceId, question);

  res.status(200).json({
   success: true,
   summary: analysisResult.summary,
   conversationId: sessionId,
   sourceId: sourceId,
  });
 } catch (error) {
  console.error("Analysis error:", error);
  res.status(500).json({ error: `An error occurred during document analysis: ${error.message}` });
 }
};

const followUpQuestion = async (req, res) => {
 try {
  const { conversationId, question, sourceId } = req.body;

  const result = await sendFollowUpMessage(conversationId, question, sourceId);

  res.json({
   success: true,
   summary: result.summary,
   detailedResponse: result.detailedResponse,
  });
 } catch (error) {
  console.error("Follow-up error:", error);
  res.status(500).json({ error: `An error occurred processing follow-up question: ${error.message}` });
 }
};

module.exports = { uploadDocument, analyzeDocument, followUpQuestion };
