 module.exports = {
  config: {
    name: "waifu",
    aliases: ["anime"],
    version: "5.0",
    author: "Killah",
    countDown: 5,
    role: 0,
    shortDescription: "Anime image",
    longDescription: "Send random anime image",
    category: "admin du bot",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {

    const axios = require("axios");
    const fs = require("fs-extra");
    const path = require("path");

    try {

      // API image
      const res = await axios.get("https://picsum.photos/500");

      // chemin fichier
      const imgPath = path.join(__dirname, "cache", `anime_${Date.now()}.jpg`);

      // créer dossier cache
      fs.ensureDirSync(path.dirname(imgPath));

      // télécharger image
      const img = await axios({
        url: res.request.res.responseUrl,
        method: "GET",
        responseType: "stream"
      });

      // écrire image
      const writer = fs.createWriteStream(imgPath);

      img.data.pipe(writer);

      writer.on("finish", async () => {

        await api.sendMessage(
          {
            body: "🖼️ | Image envoyée",
            attachment: fs.createReadStream(imgPath)
          },
          event.threadID
        );

        fs.unlinkSync(imgPath);
      });

      writer.on("error", () => {
        api.sendMessage(
          "❌ | Impossible d'envoyer l'image.",
          event.threadID
        );
      });

    } catch (e) {

      console.log(e);

      api.sendMessage(
        "❌ | API Error.",
        event.threadID
      );
    }
  }
};
