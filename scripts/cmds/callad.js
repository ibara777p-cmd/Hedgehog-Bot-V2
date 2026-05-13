const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];
const moment = require('moment'); // Add moment.js for date/time

module.exports = {
	config: {
		name: "callad",
		version: "2.4", // Updated version
		author: "Nthank",
		countDown: 5,
		role: 0,
		description: {
			en: "Send a stylized alert or report to bot admin"
		},
		category: "contacts admin",
		guide: {
			en: "   {pn} <message>"
		}
	},

	langs: {
		en: {
			missingMessage: "⛔ Please provide the message you want to dispatch to admin.",
			noAdmin: "⚠️ Bot has no admin configured.",
			replySuccess: "📤 Reply transmitted successfully to the user.",
			replyAdminSuccess: "📤 Reply sent successfully to the admin." // Corrected key
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api }) {
		const { config } = global.GoatBot;
		if (!args[0]) return message.reply(this.langs.en.missingMessage);
		if (config.adminBot.length === 0) return message.reply(this.langs.en.noAdmin);

		const { senderID, threadID, isGroup, messageReply, attachments } = event;
		const senderName = await usersData.getName(senderID);
		const threadName = isGroup ? (await threadsData.get(threadID)).threadName : "Private Chat";
		const userMessage = args.join(" ");
		const timestamp = moment().format('HH:mm:ss (Z)'); // Time format
		const adminCount = config.adminBot.length;

		const content = `✅『Message Sent!』✉️

╭───⊹⊱⋆｡˚🌸˚｡⋆⊰⊹───╮
• 💌 Whispers carried your note to the admin...
• 📇 Delivered to: ${adminCount} admin(s)
• ⏰ Time sent: ${timestamp}
• ✨ Await their gentle reply~
╰───⊹⊱⋆｡˚🌸˚｡⋆⊰⊹───╯
Thank you for your trust and patience!`;

		const formMessage = {
			body: content,
			mentions: [{ id: senderID, tag: senderName }],
			attachment: await getStreamsFromAttachment(
				[...attachments, ...(messageReply?.attachments || [])].filter(item => mediaTypes.includes(item.type))
			)
		};

		await Promise.all(config.adminBot.map(async (adminID) => {
			try {
				await api.sendMessage(formMessage, adminID);
			} catch (err) {
				log.err(`CALLAD TERMINAL ERROR (adminID: ${adminID}):`, err);
			}
		}));

		return message.reply("✅ Message dispatched successfully to the admin. They will reply shortly.");
	},

	onReply: async function ({ args, event, api, message, Reply, usersData }) {
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);
		const content = args.join(" ");
		const timestamp = moment().format('HH:mm:ss (Z)'); // Time format

		try {
			if (type === "userCallAdmin") {
				const replyToUser = {
					body: `✉️『Admin’s Reply』✅

╭───⊹⊱⋆｡˚💬˚｡⋆⊰⊹───╮
• 👤 Admin: ${senderName}
• 🕒 Time: ${timestamp}
• ✉️ Message:
💮${content}
╰───⊹⊱⋆｡˚💬˚｡⋆⊰⊹───╯

✨ You can reply to continue the talk!`,
					mentions: [{ id: event.senderID, tag: senderName }],
					attachment: await getStreamsFromAttachment(event.attachments.filter(a => mediaTypes.includes(a.type)))
				};

				api.sendMessage(replyToUser, threadID, (err, info) => {
					if (err) return message.reply(err);
					global.GoatBot.onReply.set(info.messageID, {
						commandName: "callad",
						messageID: info.messageID,
						threadID: event.threadID,
						messageIDSender: event.messageID,
						type: "adminReply"
					});
					message.reply(this.langs.en.replySuccess);
				}, messageIDSender);
			} else if (type === "adminReply") {
				//This part was missing in your original code, I've added it back.  Make sure replyToAdmin is correctly defined.
				const replyToAdmin = {
					body: `📝 Feedback from user ${senderName}:  
━━━━━━━━━━━━━━━━━━━━━━━  
🧾 Message:  
${content}  
━━━━━━━━━━━━━━━━━━━━━━━  
📡 Reply this message to continue communication.`,
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(event.attachments.filter(a => mediaTypes.includes(a.type)))
				};

				api.sendMessage(replyToAdmin, threadID, (err, info) => {
					if (err) return message.reply(err);
					global.GoatBot.onReply.set(info.messageID, {
						commandName: "callad",
						messageID: info.messageID,
						threadID: event.threadID,
						messageIDSender: event.messageID,
						type: "userCallAdmin"
					});
					message.reply(this.langs.en.replyAdminSuccess);
				}, messageIDSender);
			}
		} catch (error) {
			log.err(`Error in onReply (type: ${type}):`, error);
			message.reply("An unexpected error occurred. Please contact the bot developer.");
		}
	}
};
