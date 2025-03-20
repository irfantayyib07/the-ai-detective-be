const axios = require("axios");
const FormData = require("form-data");

const API_BASE_URL = "https://app.customgpt.ai/api/v1";
const PROJECT_ID = process.env.CUSTOMGPT_PROJECT_ID || "66012";
const API_KEY = process.env.CUSTOMGPT_API_KEY;

async function uploadDocumentSource(fileBuffer, fileName) {
 try {
  const formData = new FormData();
  formData.append("file", fileBuffer, fileName);
  formData.append("is_ocr_enabled", "true");

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

async function sendMessageWithSourceReference(sessionId, sourceId, fileName, question) {
 try {
  const prompt = `Reference the document I've uploaded (source ID: ${sourceId} and file name: ${fileName}), and answer the following question: ${question}.\n\nNote: Make sure your response is in proper markdown format which, when converted into HTML using JS libraries like "marked", results in a properly formatted HTML content, with bold headings, proper line breaks and new lines etc., but do not add horizontal lines anywhere and do not over-format, keep it simple and sensible.`;

  console.log(prompt);

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
  let summary = parts[0];
  const detailedAnalysis = parts.slice(1).join("\n\n");

  console.log(summary, detailedAnalysis);

  if (summary === detailedAnalysis) {
   summary = "";
  }

  return {
   summary,
   detailedAnalysis: detailedAnalysis || summary,
  };
 } catch (error) {
  console.error("Error sending message:", error.response?.data || error.message);
  throw new Error("Failed to get analysis from CustomGPT");
 }
}

async function sendFollowUpMessage(conversationId, question, sourceId, fileName) {
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
  let summary = parts[0];
  const detailedFollowUp = parts.slice(1).join("\n\n");

  console.log(summary, detailedFollowUp);

  if (summary === detailedFollowUp) {
   summary = "";
  }

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
