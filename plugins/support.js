const { getJson, getBuffer, command, isPrivate, sleep } = require("../lib/");

command({
    pattern: "help",
    fromMe: isPrivate,
    desc: "nezuko Support",
    type: "support"
}, async (message) => {
    const name = '𝙶𝙾𝙳 𝚉𝙴𝙽𝙾𝚇', title = "𝙉𝙀𝙕𝙐𝙆𝙊 𝙎𝙐𝙋𝙋𝙊𝙍𝙏🦋", number = '𝟿𝟷𝟿𝟽𝟺𝟺𝟷𝟶𝟾𝟿𝟽𝟶', body = "𝙶𝙾𝙳 𝚉𝙴𝙽𝙾𝚇⛒";
    const image = "https://files.catbox.moe/spmaxi.png", sourceUrl = 'https://github.com/godzenitsu/NEZUKO-V2';
    const logo = await getBuffer(image);
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG: 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐍𝐞𝐳𝐮𝐤𝐨⛭;\nTEL;type=CELL;type=VOICE;waid=${number}:${number}\nEND:VCARD`;
    const adon = { title, body, thumbnail: logo, mediaType: 1, mediaUrl: sourceUrl, sourceUrl, showAdAttribution: true, renderLargerThumbnail: false };
    await message.client.sendMessage(message.jid, { contacts: { displayName: name, contacts: [{ vcard }] }, contextInfo: { externalAdReply: adon } }, { quoted: message });
});
