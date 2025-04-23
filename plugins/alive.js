const { command, isPrivate, blackVideo } = require("../lib");

function formatUptime(seconds) {
  const pad = (s) => (s < 10 ? "0" + s : s);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
}

command(
  {
    pattern: "alive",
    fromMe: isPrivate,
    desc: "check bot is alive",
    type: "user"
  },
  async (message) => {
    const uptime = process.uptime();
    const formatted = formatUptime(uptime);

    const caption = `*𝙽𝙴𝚉𝚄𝙺𝙾 𝙸𝚂 𝙰𝙻𝙸𝚅𝙴*

*>>>>>>>>>>*

☼𝚁𝚄𝙽𝚃𝙸𝙼𝙴 : *${formatted}*
☼𝚅𝙴𝚁𝚂𝙸𝙾𝙽: 𝟷.𝟶.𝟶

*<<<<<<<<<<*`;

    // React first
    const emojis = ["♻️", "✅", "🎀", "☑️", "〽️", "📍", "👁️‍🗨️", "📛", "⭕", "♾️", "⛓️"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    await message.client.sendMessage(message.jid, {
      react: {
        text: randomEmoji,
        key: message.key
      }
    });

    // Then send the video
    await message.client.sendMessage(message.jid, {
      video: { url: "https://jerryapi.vercel.app/GUPvAd.jpg" },
      caption: caption,
      gifPlayback: false,
      mimetype: "image/jpeg"
    }, { quoted: message });
  }
);
// credits to oggy @mksir12
