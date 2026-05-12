// gpt.js - Version corrigée
const OPENAI_API_KEY = "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"; // ✅ Remplace ce texte par ta clé réelle

async function askGPT(question) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erreur askGPT:", error);
    return "❌ Désolé, je n'arrive pas à répondre pour le moment.";
  }
}

module.exports = { askGPT };
