const os = require('os');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "botinfo",
    aliases: ["sysinfo", "botstats"],
    version: "3.0",
    author: "More Time",
    role: 2,
    category: "system",
    guide: {}
  },
  onStart: async function ({ api, event, usersData }) {
    try {
      // Animation de chargement avec message aléatoire
      const loadingMessages = [
        "⏳ **Loading...** Please wait.",
        "⚡ **Processing...** Gathering stats.",
        "🌐 **Fetching Data...** Almost there.",
      ];
      const randomLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      const loadingMessage = await api.sendMessage(randomLoadingMessage, event.threadID);

      setTimeout(async () => {
        // Infos utilisateur et heure
        const userName = await usersData.getName(event.senderID); // Nom complet de l'utilisateur
        const ivoryCoastTime = moment.tz("Africa/Abidjan").format("HH:mm:ss");
        const todayDate = moment().format("ddd, MMM Do YYYY");

        // Statistiques système
        const uptime = process.uptime();
        const days = Math.floor(uptime / (3600 * 24));
        const hours = Math.floor((uptime % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const memoryUsed = (process.memoryUsage().rss / (1024 * 1024)).toFixed(2); // Mémoire utilisée en MB
        const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2); // Mémoire totale en GB
        const cpuLoad = os.loadavg() && os.loadavg()[0] ? os.loadavg()[0].toFixed(2) : "N/A"; // Charge CPU

        // Calcul du status basé sur des chiffres
        const memoryPercentage = ((memoryUsed / (totalMemory * 1024)) * 100).toFixed(2); // % de mémoire utilisée
        const cpuHealth = parseFloat(cpuLoad) < 2 ? "🟢" : "🟠"; // Si la charge CPU est inférieure à 2, c'est OK, sinon attention

        // Préparation du message sans l'image pour l'instant
        const message = `
📋 **SYSTEM INFORMATION**
**User**: @${userName}
**Date**: ${todayDate}
**Time (Côte d'Ivoire)**: ${ivoryCoastTime}

🖥️ **SYSTEM STATS**
**Uptime**: ${uptimeString}
**Memory Usage**: ${memoryUsed} MB / ${totalMemory} GB (${memoryPercentage}%)
**CPU Load**: ${cpuLoad} (${cpuHealth})

⚙️ **BOT STATUS**
📊 **Memory Usage**: ${memoryUsed} MB
⚡ **CPU Load**: ${cpuLoad}

📜 **HELP INFO**
For more commands, type **.help**

🇨🇮 **Côte d'Ivoire** | Proudly represented 🇨🇮
`;

        // Envoi du message sans l'image
        const sendMessage = await api.sendMessage(message, event.threadID);

        // Image du bot
        const botImageUrl = "https://www.example.com/bot_image.jpg"; // Remplacer par l'URL de votre image réelle

        // Envoi de l'image en pièce jointe
        api.sendMessage({
          attachment: botImageUrl
        }, event.threadID);

        // Suppression après 2 minutes
        setTimeout(() => {
          api.deleteMessage(loadingMessage.messageID);
          api.deleteMessage(sendMessage.messageID);
        }, 120000); // 2 minutes

      }, 3000); // Attente de 3 secondes

    } catch (error) {
      console.error("Error in botinfo command:", error);
      api.sendMessage("⚠️ **Something went wrong while fetching the stats.** Please try again later.", event.threadID);
    }
  }
};
