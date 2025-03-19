const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const API_BASE_URL = "https://app.customgpt.ai/api/v1";
const PROJECT_ID = process.env.CUSTOMGPT_PROJECT_ID || "66012";
const API_KEY = process.env.CUSTOMGPT_API_KEY;

async function uploadDocumentSource(fileBuffer, fileName) {
 try {
  const formData = new FormData();
  formData.append("file", fileBuffer, fileName);

  const response = await axios.post(`${API_BASE_URL}/projects/${PROJECT_ID}/sources`, formData, {
   headers: {
    Authorization: `Bearer ${API_KEY}`,
    ...formData.getHeaders(),
   },
  });

  return response.data.data.pages[0].id;
 } catch (error) {
  console.error("Error uploading document source:", error.response?.data || error.message);
  throw new Error(`Failed to upload document as source: ${error.message}`);
 }
}

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

  const aiResponse = response.data.data.openai_response;
  const parts = aiResponse.split("\n\n");
  const summary = parts[0];
  const detailedAnalysis = parts.slice(1).join("\n\n");

  return {
   summary,
   detailedAnalysis: detailedAnalysis || summary,
  };
 } catch (error) {
  console.error("Error sending message:", error.response?.data || error.message);
  throw new Error("Failed to get analysis from CustomGPT");
 }
}

async function sendFollowUpMessage(conversationId, question, sourceId) {
 try {
  // let prompt = `Follow-up question: ${question}`;
  // if (sourceId) {
  //  prompt = `Regarding the document (source ID: ${sourceId}). ${prompt}`;
  // }

  const response = await axios.post(
   `${API_BASE_URL}/projects/${PROJECT_ID}/conversations/${conversationId}/messages`,
   {
    prompt: question,
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
  const parts = aiResponse.split("\n\n");
  const summary = parts[0];
  const detailedFollowUp = parts.slice(1).join("\n\n");

  return {
   summary,
   detailedResponse: detailedFollowUp || summary,
  };
 } catch (error) {
  console.error("Error sending follow-up message:", error.response?.data || error.message);
  throw new Error("Failed to get response from CustomGPT");
 }
}

module.exports = {
 uploadDocumentSource,
 createConversation,
 sendMessageWithSourceReference,
 sendFollowUpMessage,
};
