const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "story",
    version: "1.2",
    author: "Aesther",
    shortDescription: {
      fr: "Publie du contenu dans la story"
    },
    longDescription: {
      fr: "Permet de publier du texte, une image, une vidéo ou un audio dans la story du bot."
    },
    category: "media",
    guide: {
      fr: "{pn} [texte] : publier du texte\n{pn} + pièce jointe : publier fichier (image/vidéo/audio)\n{pn} + réponse : publier le contenu du message répondu"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { messageReply, attachments } = event;
    const text = args.join(" ");
    const content = messageReply?.body || text;
    const files = [];

    const sendStyle = (msg) =>
      message.reply(`🌀──「 𝙎𝙩𝙤𝙧𝙮 」──🌀\n${msg}\n──🌀───🌀───🌀──`);

    // Récupération des fichiers (jointe ou réponse)
    const fileSources = attachments.length > 0 ? attachments : messageReply?.attachments || [];

    try {
      for (const file of fileSources) {
        const fileExt = getFileExtension(file.type);
        if (!fileExt) continue;

        const filePath = path.join(__dirname, "cache", `${Date.now()}.${fileExt}`);
        const stream = await global.utils.getStreamFromURL(file.url);
        await global.utils.downloadFile(file.url, filePath);
        files.push(fs.createReadStream(filePath));
      }

      // Envoi de la story
      if (files.length > 0) {
        // Si plusieurs fichiers, envoie seulement le premier
        await api.sendStory(content || "", files[0]);
      } else if (content) {
        await api.sendStory(content);
      } else {
        return sendStyle("⚠️ Veuillez fournir un texte ou un fichier à publier en story.");
      }

      // Nettoyage
      for (const stream of files) {
        const pathToDelete = stream.path;
        if (fs.existsSync(pathToDelete)) fs.unlinkSync(pathToDelete);
      }

      return sendStyle("✅ Publication dans la story réussie !");
    } catch (err) {
      return sendStyle(`❌ Erreur : ${err.message}`);
    }
  }
};

// Fonction pour détecter le bon type de fichier
function getFileExtension(type) {
  switch (type) {
    case "photo": return "jpg";
    case "video": return "mp4";
    case "audio": return "mp3";
    default: return null;
  }
}
