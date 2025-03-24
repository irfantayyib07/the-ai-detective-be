const axios = require("axios");

const API_BASE_URL = "https://app.customgpt.ai/api/v1";
const PROJECT_ID = process.env.CUSTOMGPT_PROJECT_ID || "66012";
const API_KEY = process.env.CUSTOMGPT_API_KEY;

async function deleteConversation(sessionId) {
 try {
  const response = await axios.post(`${API_BASE_URL}/projects/${PROJECT_ID}/conversations/${sessionId}`, {
   headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
   },
  });

  return response.data.data.deleted;
 } catch (error) {
  console.error("Error creating conversation:", error.response?.data || error.message);
  throw new Error("Failed to create conversation");
 }
}

module.exports = {
 deleteConversation,
};
