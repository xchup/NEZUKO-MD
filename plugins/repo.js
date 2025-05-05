const { command } = require("../lib/");

command(
  {
    pattern: "script",
    fromMe: false,
    desc: "Show Nezuko's website",
    type: "user",
  },
  async (message, match, m, client) => {
    const caption = "```" +
`✧ BOT NAME : NEZUKO MD

✧ ABOUT : A whatsapp bot based on X-Asena

✧ WEB   : https://zenox-web.vercel.app/` +
"```";

    const thumb = "https://ik.imagekit.io/Oggy/UMfhtn_hlIN1RqZF.jpg";

    await client.sendMessage(message.jid, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: "𝙽𝙴𝚉𝚄𝙺𝙾 𝙼𝙳",
          body: "𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙾𝚃",
          thumbnailUrl: thumb,
          mediaType: 1,
          mediaUrl: "https://ik.imagekit.io/Oggy/UMfhtn_hlIN1RqZF.jpg",
          sourceUrl: "https://zenox-web.vercel.app/",
          showAdAttribution: true,
          renderLargerThumbnail: false,
        },
      },
    }, { quoted: m });
  }
);
