
module.exports = {
  config: {
    name: "join",
    aliases: ['addme', 'joinme'],
    version: "1.0",
    author: "Samir B. Thakuri",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Add user to support group",
    },
    longDescription: {
      en: "This command adds the user to the group wher bot exist",
    },
    category: "owner",
    guide: {
      en: "To use this command, simply type !join <threadID>.",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    const supportGroupId = args[0];
    if (!supportGroupId) {
      api.sendMessage("LE ID DU GROUPE ???🔴.", event.threadID);
      return;
    }
    const threadID = event.threadID;
    const userID = event.senderID;
    const threadInfo = await api.getThreadInfo(supportGroupId);
    const participantIDs = threadInfo.participantIDs;
    if (participantIDs.includes(userID)) {
      api.sendMessage(
        "BOSS VOUS ÊTES DÉJÀ DANS SE GROUPE 🪽",
        threadID
      );
    } else {
      api.addUserToGroup(userID, supportGroupId, (err) => {
        if (err) {
          console.error("🔴| Failed to add user to support group:", err);
          api.sendMessage("J'SUIS PAS DANS CE GROUPE🧍", threadID);
        } else {
          api.sendMessage(
            "BOSS.... VOUS AVEZ ÉTÉ AJOUTER AU GROUPE 👑.",
            threadID
          );
        }
      });
    }
  },
};
