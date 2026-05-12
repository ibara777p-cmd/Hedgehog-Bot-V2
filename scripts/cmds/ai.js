// scripts/cmds/ai.js
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
      en: " {pn} <question>"
    }
  },
  langs: {
    en: {
      noInput: "❌ Veuillez poser une question après la commande.",
      apiError: "⚠️ Une erreur s'est produite avec l'API OpenAI.",
      waiting: " L'IA réfléchit..."
    }
  },
  onStart: async function ({ message, args, getLang }) {
    const question = args.join(" ");
    if (!question) {
      return message.reply(getLang("noInput"));
    }

    // ⚠️ REMPLACE CETTE CLÉ PAR LA TIENNE (garde les guillemets)
    const OPENAI_API_KEY = "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";

    const waitMessage = await message.reply(getLang("waiting"));
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: question }],
          max_tokens: 1000
        })
      });

      const data = await response.json();
      let replyText = data?.choices?.[0]?.message?.content;

      if (replyText) {
        await message.reply(replyText);
        await message.unsend(waitMessage.messageID);
      } else {
        throw new Error(getLang("apiError"));
      }
    } catch (error) {
      console.error("Erreur API OpenAI:", error);
      await message.edit(waitMessage.messageID, getLang("apiError"));
    }
  }
};
