

// ai.js - Version complète et corrigée
const { askGPT } = require("./../../gpt.js"); // ✅ Le chemin est corrigé

module.exports = {
  config: {
    name: "ai",
    version: "1.0",
    author: "TonNom",
    countDown: 5,
    role: 0,
    shortDescription: "Discuter avec une intelligence artificielle (OpenAI)",
    longDescription: "Pose une question à l'IA et obtiens une réponse.",
    category: "fun",
    guide: {
      en: " {pn} <question>",
    },
  },
  langs: {
    en: {
      noInput: "❌ Veuillez poser une question après la commande.",
      apiError: "⚠️ Une erreur s'est produite avec l'API OpenAI.",
      waiting: "🧠 L'IA réfléchit...",
    },
  },
  onStart: async function ({ message, args, getLang }) {
    const question = args.join(" ");
    if (!question) {
      return message.reply(getLang("noInput"));
    }

    const waitMessage = await message.reply(getLang("waiting"));
    try {
      const replyText = await askGPT(question);
      await message.edit(waitMessage.messageID, replyText);
    } catch (error) {
      console.error("Erreur onStart:", error);
      await message.edit(waitMessage.messageID, getLang("apiError"));
    }
  },
};
