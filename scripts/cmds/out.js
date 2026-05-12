
module.exports = {
    config: {
        name: "out",
        version: "1.0",
        author: "XyryllPanget",
        countDown: 5,
        role: 2,
        shortDescription: {
            vi: "",
            en: "Kick the bot from the group"
        },
        longDescription: {
            vi: "",
            en: "Remove bot from group chat"
        },
        category: "owner",
        guide: {
            vi: "",
            en: "Just type: غادر"
        }
    },

    onStart: async function ({ api, args, event }) {
        try {
            const botID = api.getCurrentUserID();
            let threadID = event.threadID;

            // Si un ID de groupe est fourni en argument
            if (args[0]) {
                if (!isNaN(args[0])) {
                    threadID = args[0];
                } else {
                    return api.sendMessage("❌ Thread ID invalide. Il doit être un nombre.", event.threadID);
                }
            }

            await api.removeUserFromGroup(botID, threadID);
            
            // Message de confirmation seulement si on est dans un autre groupe
            if (threadID !== event.threadID) {
                api.sendMessage(`✅ Bot a quitté le groupe ${threadID}.`, event.threadID);
            }

        } catch (error) {
            console.error(error);
            api.sendMessage("❌ Impossible de quitter le groupe.", event.threadID);
        }
    }
};
