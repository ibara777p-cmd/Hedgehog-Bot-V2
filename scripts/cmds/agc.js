module.exports.config = {
  name: "agc",
  version: "1.0",
  author: "Mueid Mursalin Rifat", //Dont Change
  role: 2,
  description: "Add a user to all group chats the bot has joined",
  category: "admin",
  guide: "{pn} [uid]"
};

module.exports.onStart = async function ({ api, event, args }) {
  const targetUID = args[0];
  if (!targetUID || isNaN(targetUID)) {
    return api.sendMessage("❗ Please provide a valid user UID.\nUsage: agc [uid]", event.threadID, event.messageID);
  }

  try {
    const allThreads = await api.getThreadList(100, null, ["INBOX"]);
    const groupThreads = allThreads.filter(thread => thread.isGroup);

    let success = 0, failed = 0;

    for (const thread of groupThreads) {
      try {
        await api.addUserToGroup(targetUID, thread.threadID);
        success++;
      } catch (err) {
        failed++;
      }
    }

    api.sendMessage(
      `✅ Finished adding UID ${targetUID} to all group chats.\n` +
      `➕ Added to: ${success} groups\n` +
      `❌ Failed in: ${failed} groups (maybe bot has no admin access)`,
      event.threadID,
      event.messageID
    );
  } catch (err) {
    console.error("Error in agc command:", err);
    return api.sendMessage("❌ An error occurred: " + err.message, event.threadID, event.messageID);
  }
};
