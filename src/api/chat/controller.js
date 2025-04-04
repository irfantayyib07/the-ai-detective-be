const {
 uploadDocumentSource,
 createConversation,
 sendMessageWithSourceReference,
 sendFollowUpMessage,
 sendReindexDocumentRequest,
} = require("./services");
const Conversation = require("../conversation/model");

const uploadDocument = async (req, res) => {
 try {
  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;

  const sourceId = await uploadDocumentSource(fileBuffer, fileName);

  res.status(200).json({
   success: true,
   message: "Document uploaded successfully",
   sourceId: sourceId,
   fileName,
  });
 } catch (error) {
  console.error("Document upload error:", error);
  res.status(500).json({
   success: false,
   error: `An error occurred during document upload: ${error.message}`,
  });
 }
};

const reindexDocument = async (req, res) => {
 try {
  const pageId = req.body.pageId;

  const response = await sendReindexDocumentRequest(pageId);

  res.status(200).json({
   success: true,
   data: response.data.updated,
   message: "Document reindexed successfully",
  });
 } catch (error) {
  console.error("Reindexing error:", error);
  res.status(500).json({ error: `An error occurred during document reindexing: ${error.message}` });
 }
};

const analyzeDocument = async (req, res) => {
 try {
  const question = req.body.question;
  const sourceId = req.body.sourceId;
  const fileName = req.body.fileName;

  // const fileBuffer = req.file.buffer;
  // const fileName = req.file.originalname;

  // const sourceId = await uploadDocumentSource(fileBuffer, fileName);
  const sessionId = await createConversation();

  Conversation.create({ id: sessionId });

  const aiResponse = await sendMessageWithSourceReference(sessionId, sourceId, fileName, question);

  res.status(200).json({
   success: true,
   aiResponse,
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
  const { conversationId, question, sourceId, fileName } = req.body;

  const aiResponse = await sendFollowUpMessage(conversationId, question, sourceId, fileName);

  res.json({
   success: true,
   aiResponse,
  });
 } catch (error) {
  console.error("Follow-up error:", error);
  res.status(500).json({ error: `An error occurred processing follow-up question: ${error.message}` });
 }
};

module.exports = { uploadDocument, reindexDocument, analyzeDocument, followUpQuestion };
