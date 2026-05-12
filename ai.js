// scripts/cmds/ai.js
module.exports = {
    config: {
        name: "ai",
        version: "1.0",
        author: "TonNom",
        countDown: 5,
        role: 0,
        shortDescription: "Discuter avec une intelligence artificielle",
        longDescription: "Pose une question à l'IA et obtiens une réponse.",
        category: "fun",
        guide: { en: "   {pn} <question>" }
    },
    langs: {
        en: {
            noInput: "❌ Veuillez poser une question après la commande.",
            apiError: "⚠️ Une erreur s'est produite lors de la communication avec l'API IA.",
            waiting: "🤖 L'IA réfléchit..."
        }
    },
    onStart: async function ({ message, args, getLang }) {
        const question = args.join(" ");
        if (!question) {
            return message.reply(getLang("noInput"));
        }

        const GEMINI_API_KEY = process.env.GEMINI_KEY;
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const waitMessage = await message.reply(getLang("waiting"));

        try {
            const response = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: question }] }]
                })
            });

            const data = await response.json();
            let replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (replyText) {
                await message.reply(replyText);
                await message.unsend(waitMessage.messageID);
            } else {
                throw new Error(getLang("apiError"));
            }
        } catch (error) {
            console.error("Erreur API Gemini:", error);
            await message.edit(waitMessage.messageID, getLang("apiError"));
        }
    }
};
