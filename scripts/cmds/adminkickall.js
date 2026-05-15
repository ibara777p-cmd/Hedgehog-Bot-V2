
module.exports = {
  config: {
    name: "adminkickall",
    version: "3.0",
    author: "Messie Osango",
    role: 2,
    shortDescription: {
      fr: "Retirer les droits admin de tous les membres sauf le bot"
    },
    longDescription: {
      fr: "Retire le statut admin de tous les membres du groupe (actuel ou spécifié) sauf le bot"
    },
    category: "admin",
    guide: {
      fr: "{prefix}adminkickall [groupID]"
    }
  },
  onStart: async function ({ api, event, args, message }) {
    try {
      const botAdmins = global.GoatBot.config.adminBot;
      if (!botAdmins.includes(event.senderID)) {
        return message.reply("❌ Accès réservé aux administrateurs du GoatBot");
      }

      let targetThreadID = event.threadID;
      
      if (args[0] && args[0].match(/^\d+$/)) {
        targetThreadID = args[0];
      }

      const threadInfo = await api.getThreadInfo(targetThreadID);
      const botID = api.getCurrentUserID();
      const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
      
      if (!isBotAdmin) {
        return message.reply(`🔒 Je dois être admin dans le groupe ${targetThreadID}`);
      }

      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
      const otherAdmins = adminIDs.filter(id => id !== botID);

      if (otherAdmins.length === 0) {
        return message.reply(`ℹ Il n'y a pas d'autres administrateurs à retirer dans le groupe ${targetThreadID}`);
      }

      let successCount = 0;
      let failCount = 0;

      for (const adminID of otherAdmins) {
        try {
          await api.changeAdminStatus(targetThreadID, adminID, false);
          successCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to remove admin ${adminID}:`, error);
          failCount++;
        }
      }

      let replyMessage = `✅ ${successCount} administrateur(s) retiré(s) avec succès du groupe ${targetThreadID}`;
      if (failCount > 0) {
        replyMessage += `\n⚠ Échec pour ${failCount} administrateur(s)`;
      }

      return message.reply(replyMessage);

    } catch (error) {
      console.error(error);
      return message.reply("⚠ Erreur système");
    }
  }
};
