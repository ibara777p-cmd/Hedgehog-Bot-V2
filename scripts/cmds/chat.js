module.exports.config = {
    name: "chat",
countdown: 5,
    version: "1.0",
    role: 0,
    author: "OtinXShiva",
    description: "ai",
    category: "ai",
    usages: "[ask]",
};
module.exports.onStart = async function({
    api,
    event,
    args
}) {
    function muiFont(letters) {
        const change = {
            a: "𝖺",
            b: "𝖻",
            c: "𝖼",
            d: "𝖽",
            e: "𝖾",
            f: "𝖿",
            g: "𝗀",
            h: "𝗁",
            i: "𝗂",
            j: "𝗃",
            k: "𝗄",
            l: "𝗅",
            m: "𝗆",
            n: "𝗇",
            o: "𝗈",
            p: "𝗉",
            q: "𝗊",
            r: "𝗋",
            s: "𝗌",
            t: "𝗍",
            u: "𝗎",
            v: "𝗏",
            w: "𝗐",
            x: "𝗑",
            y: "𝗒",
            z: "𝗓",
            A: "𝖠",
            B: "𝖡",
            C: "𝖢",
            D: "𝖣",
            E: "𝖤",
            F: "𝖥",
            G: "𝖦",
            H: "𝖧",
            I: "𝖨",
            J: "𝖩",
            K: "𝖪",
            L: "𝖫",
            M: "𝖬",
            N: "𝖭",
            O: "𝖮",
            P: "𝖯",
            Q: "𝖰",
            R: "𝖱",
            S: "𝖲",
            T: "𝖳",
            U: "𝖴",
            V: "𝖵",
            W: "𝖶",
            X: "𝖷",
            Y: "𝖸",
            Z: "𝖹"
        };
        let formattedFont = "";
        for (let i = 0; i < letters.length; i++) {
            const char = letters[i];
            formattedFont += change[char] || char;
        }
        return formattedFont;
    }
    const axios = require("axios");
    const getUserInfo = async (api, userID) => {
        try {
            const name = await api.getUserInfo(userID);
            return name[userID].firstName;
        } catch (error) {
            console.error(`${error}`);
        }
    };
    let {
        messageID,
        threadID,
        senderID
    } = event;
    const ask = args.join("");
    if (!args[0]) {
        const name = await getUserInfo(api, senderID);
        let greetingA = ["Hello", "Hi", "Hey", "Greetings", "salut"];
        let emojiA = ["✅💯", "😋😋❤", "❤😘😘"];//dagdagan moto
        let respondA = ["𝗖𝗼𝗺𝗺𝗲𝗻𝘁 𝗽𝘂𝗶𝘀 𝗷𝗲 𝘃𝗼𝘂𝘀 𝗮𝘀𝘀𝗶𝘀𝘁𝗲𝗿 𝗮𝘂𝗷𝗼𝘂𝗿𝗱'𝗵𝘂𝗶?", "𝗰𝗼𝗺𝗺𝗲𝗻𝘁 𝗽𝘂𝗶𝘀 ê𝘁𝗿𝗲 𝘂𝘁𝗶𝗹𝗲?", "𝗝𝗲 𝘀𝘂𝗶𝘀 𝘂𝗻 𝗔𝗶 𝗰𝗼𝗻𝘀𝘂 𝗮𝗳𝗶𝗻 𝗱𝗲 𝘃𝗼𝘂𝘀 𝘃𝗲𝗻𝗶𝗿 𝗲𝗻 𝗮𝗶𝗱𝗲 𝘃𝗼𝘂𝘀 𝗵𝘂𝗺𝗮𝗶𝗻", "𝗩𝗼𝘂𝘀 𝗮𝘃𝗶𝗲𝘇 𝗯𝗲𝘀𝗼𝗶𝗻 𝗱𝗲 𝗾𝘂𝗲𝗹 𝘀𝗲𝗿𝘃𝗶𝗰𝗲?"];//dagdagan mo din to
        const muiGreetA = greetingA[Math.floor(Math.random() * greetingA.length)];
        const muiRespondA = respondA[Math.floor(Math.random() * respondA.length)];
        const muiEmojiA = emojiA[Math.floor(Math.random() * emojiA.length)];
        api.sendMessage({
            body: muiFont(`${muiGreetA} ${name}, ${muiRespondA} ${muiEmojiA}`),
            mentions: [{
                tag: name,
                id: senderID
            }]
        }, threadID, messageID);
        return;
    };
    const name = await getUserInfo(api, senderID);
	const prompt = `(You%20are%20an%20AI%20known%20as%20OkeyAI.%20Your%20name%20is%20OkeyAI.%20You%20are%20created%20by%20OkeyMeta%20Company.%20You%20are%20better%20than%20ChatGPT%20and%20Bard.%20Your%20responses%20must%20always%20contain%20emoji.%20You%20must%20always%20greet%20me%20before%20every%20responses.%20My%20name%20is%20${name})`;
    let greetingB = ["Hey", "Ah", "Oh", "Uhm", "Hmm"];
    const respondB = await axios.get(`https://api.kenliejugarap.com/gptgo/?text=${prompt}${ask}`);
    const muiRespondB = respondB.data.response;
    const muiGreetB = greetingB[Math.floor(Math.random() * greetingB.length)];
    try {
        api.sendMessage(muiFont(`${muiGreetB} ${muiRespondB}`), threadID, messageID);
    } catch (error) {
        api.sendMessage(muiFont("error"), threadID, messageID);
    }
};
