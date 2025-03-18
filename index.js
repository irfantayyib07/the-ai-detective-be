const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3500;

// CustomGPT AI configuration
const PROJECT_ID = process.env.CUSTOMGPT_PROJECT_ID || "66012";
const API_BASE_URL = "https://app.customgpt.ai/api/v1";
const API_KEY = process.env.CUSTOMGPT_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  const uploadDir = "uploads/";
  if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
  }
  cb(null, uploadDir);
 },
 filename: (req, file, cb) => {
  cb(null, Date.now() + path.extname(file.originalname));
 },
});

const upload = multer({ storage });

// Create 'outputs' directory for analysis results
const outputsDir = "outputs/";
if (!fs.existsSync(outputsDir)) {
 fs.mkdirSync(outputsDir, { recursive: true });
}

// Function to upload a document as a source to CustomGPT
async function uploadDocumentSource(filePath, fileName) {
 try {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath), fileName);

  const response = await axios.post(`${API_BASE_URL}/projects/${PROJECT_ID}/sources`, formData, {
   headers: {
    Authorization: `Bearer ${API_KEY}`,
    ...formData.getHeaders(),
   },
  });

  return response.data.data.pages[0].id; // Return the source ID
 } catch (error) {
  console.error("Error uploading document source:", error.response?.data || error.message);
  throw new Error(`Failed to upload document as source: ${error.message}`);
 }
}

// Function to create a new conversation in CustomGPT
async function createConversation() {
 try {
  const response = await axios.post(
   `${API_BASE_URL}/projects/${PROJECT_ID}/conversations`,
   { name: "New Conversation" },
   {
    headers: {
     Authorization: `Bearer ${API_KEY}`,
     "Content-Type": "application/json",
     Accept: "application/json",
    },
   },
  );

  return response.data.data.session_id;
 } catch (error) {
  console.error("Error creating conversation:", error.response?.data || error.message);
  throw new Error("Failed to create conversation");
 }
}

// Function to send message to CustomGPT referencing the uploaded source
async function sendMessageWithSourceReference(sessionId, sourceId, question) {
 try {
  const prompt = `Reference the document I've uploaded (source ID: ${sourceId}) and answer this question: ${question}`;

  const response = await axios.post(
   `${API_BASE_URL}/projects/${PROJECT_ID}/conversations/${sessionId}/messages`,
   {
    prompt: prompt,
    response_source: "default",
   },
   {
    headers: {
     Authorization: `Bearer ${API_KEY}`,
     "Content-Type": "application/json",
     Accept: "application/json",
    },
    params: {
     stream: false,
     lang: "en",
    },
   },
  );

  // Extract AI response
  const aiResponse = response.data.data.openai_response;

  // Split response into summary (first paragraph) and detailed analysis (rest)
  const parts = aiResponse.split("\n\n");
  const summary = parts[0];
  const detailedAnalysis = parts.slice(1).join("\n\n");

  return {
   summary,
   detailedAnalysis: detailedAnalysis || summary, // If no detailed analysis, use summary
  };
 } catch (error) {
  console.error("Error sending message:", error.response?.data || error.message);
  throw new Error("Failed to get analysis from CustomGPT");
 }
}

// API endpoint for document analysis - works with any file type
app.post("/analyze", upload.single("document"), async (req, res) => {
 try {
  // Check if a file was uploaded and a question was provided
  if (!req.file) {
   return res.status(400).json({ error: "No document uploaded" });
  }

  const question = req.body.question;
  if (!question) {
   return res.status(400).json({ error: "No question provided" });
  }

  // Get the file path of the uploaded document
  const documentPath = req.file.path;
  const fileName = req.file.originalname;

  // 1. Upload the document as a source to CustomGPT
  const sourceId = await uploadDocumentSource(documentPath, fileName);

  // 2. Create a new conversation
  const sessionId = await createConversation();

  // 3. Send a message referencing the source and containing the question
  const analysisResult = await sendMessageWithSourceReference(sessionId, sourceId, question);

  // 4. Generate a filename for the analysis output
  const outputFilename = `analysis_${Date.now()}.txt`;
  const outputPath = path.join(outputsDir, outputFilename);

  // 5. Write the detailed analysis to a file
  fs.writeFileSync(outputPath, analysisResult.detailedAnalysis);

  // 6. Generate a download URL
  const downloadUrl = `/download/${outputFilename}`;

  // 7. Return the download link and brief summary
  res.json({
   success: true,
   downloadUrl,
   summary: analysisResult.summary,
   conversationId: sessionId,
   sourceId: sourceId,
  });
 } catch (error) {
  console.error("Analysis error:", error);
  res.status(500).json({ error: `An error occurred during document analysis: ${error.message}` });
 }
});

// API endpoint for follow-up questions using existing conversation
app.post("/follow-up", async (req, res) => {
 try {
  const { conversationId, question, sourceId } = req.body;

  if (!conversationId) {
   return res.status(400).json({ error: "No conversation ID provided" });
  }

  if (!question) {
   return res.status(400).json({ error: "No question provided" });
  }

  // Send follow-up message
  let prompt = `Follow-up question: ${question}`;
  if (sourceId) {
   prompt = `Regarding the document (source ID: ${sourceId}). ${prompt}`;
  }

  const response = await axios.post(
   `${API_BASE_URL}/projects/${PROJECT_ID}/conversations/${conversationId}/messages`,
   {
    prompt: prompt,
    response_source: "default",
   },
   {
    headers: {
     Authorization: `Bearer ${API_KEY}`,
     "Content-Type": "application/json",
     Accept: "application/json",
    },
    params: {
     stream: false,
     lang: "en",
    },
   },
  );

  const aiResponse = response.data.data.openai_response;

  // Split response into summary and detailed parts
  const parts = aiResponse.split("\n\n");
  const summary = parts[0];
  const detailedFollowUp = parts.slice(1).join("\n\n");

  // Generate output file
  const outputFilename = `followup_${Date.now()}.txt`;
  const outputPath = path.join(outputsDir, outputFilename);
  fs.writeFileSync(outputPath, aiResponse);

  res.json({
   success: true,
   downloadUrl: `/download/${outputFilename}`,
   summary: summary,
   detailedResponse: detailedFollowUp || summary,
  });
 } catch (error) {
  console.error("Follow-up error:", error);
  res.status(500).json({ error: `An error occurred processing follow-up question: ${error.message}` });
 }
});

// Route for downloading analysis files
app.get("/download/:filename", (req, res) => {
 const filename = req.params.filename;
 const filePath = path.join(outputsDir, filename);

 if (fs.existsSync(filePath)) {
  res.download(filePath);
 } else {
  res.status(404).json({ error: "File not found" });
 }
});

// Simple health check endpoint
app.get("/health", (req, res) => {
 res.json({ status: "ok" });
});

app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});
