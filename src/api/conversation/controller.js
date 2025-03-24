const Conversation = require("./model");
const { deleteConversation } = require("./services");

const deleteAllConversations = async (req, res) => {
 try {
  const conversations = await Conversation.find();

  if (!conversations.length) {
   return res.status(404).json({ success: false, message: "No conversations found", data: null });
  }

  await Promise.all(conversations.map(convo => deleteConversation(convo.id)));

  await Conversation.deleteMany({});

  res.status(200).json({
   success: true,
   message: "All conversations deleted successfully",
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

module.exports = { deleteAllConversations };
