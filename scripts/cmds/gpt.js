const OPENAI_API_KEY = "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";  // ← mets ta clé ici

async function askGPT(question) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }]
    })
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

module.exports = { askGPT };
