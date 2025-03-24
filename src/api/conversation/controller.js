const Conversation = require("./model");
const { deleteConversation } = require("./services");

const deleteAllConversations = async (req, res) => {
 try {
  const conversations = await Conversation.find();

  if (!conversations.length) {
   return res.status(404).json({
    success: false,
    message: "No conversations found",
    data: null,
   });
  }

  const results = await Promise.allSettled(
   conversations.map(async convo => {
    try {
     await deleteConversation(convo.id);
     return { id: convo.id, success: true };
    } catch (error) {
     return {
      id: convo.id,
      success: false,
      error: error.message,
     };
    }
   }),
  );

  const failures = results.filter(result => result.value && result.value.success === false);

  await Conversation.deleteMany({});

  if (failures.length) {
   return res.status(207).json({
    success: true,
    message: `Conversations deleted from database, but ${failures.length} network requests failed`,
    data: {
     totalConversations: conversations.length,
     failedRequests: failures.map(f => f.value),
    },
   });
  }

  return res.status(200).json({
   success: true,
   message: "All conversations deleted successfully",
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

module.exports = { deleteAllConversations };
