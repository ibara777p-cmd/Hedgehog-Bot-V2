const { askGPT } = require("./../../gpt.js"); // Adapte le chemin si besoin

// ... (début du code inchangé)

onStart: async function ({ message, args, getLang }) {
  const question = args.join(" ");
  if (!question) {
    return message.reply(getLang("noInput"));
  }

  const waitMessage = await message.reply(getLang("waiting"));
  try {
    const replyText = await askGPT(question);
    // ... (gestion de la réponse)
  } catch (error) {
    console.error("Erreur :", error);
    await message.edit(waitMessage.messageID, getLang("apiError"));
  }
}
