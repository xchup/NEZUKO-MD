const { command } = require("../lib/");
const axios = require("axios");

command(
  {
    pattern: "repo",
    fromMe: false,
    desc: "Fetch Nezuko bot repo info",
    type: "user",
  },
  async (message, match, m, client) => {
    try {
      const { data } = await axios.get("https://api.github.com/repos/Dinkenser12/Nezuko-kamado");

      const repoName = data.name || "Unknown";
      const repoDesc = data.description || "No description available.";
      const repoUrl = data.html_url || "https://github.com/Dinkenser12/Nezuko-kamado";
      const stars = data.stargazers_count || 0;
      const forks = data.forks_count || 0;

      const caption = 
`*𝙽𝙰𝙼𝙴     : ${repoName}*

*𝙰𝙱𝙾𝚄𝚃    : 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙾𝚃*

*𝚂𝚃𝙰𝚁𝚂    : ${stars}*

*𝙵𝙾𝚁𝙺𝚂    : ${forks}*

*𝚄𝚁𝙻      : ${repoUrl}*`;

      const thumb = "https://jerryapi.vercel.app/RqDM4O.jpg";

      await client.sendMessage(message.jid, {
        text: caption,
        contextInfo: {
          externalAdReply: {
            title: "𝚀𝚄𝙴𝙴𝙽 𝙽𝙴𝚉𝚄𝙺𝙾",
            body: "𝚁𝙴𝙿𝙾𝚂𝙸𝚃𝙾𝚁𝚈 ⬇️",
            thumbnailUrl: thumb,
            mediaType: 1,
            mediaUrl: repoUrl,
            sourceUrl: repoUrl,
            showAdAttribution: true,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });

    } catch (err) {
      console.error("❌ GitHub Fetch Error:", err);
      await client.sendMessage(message.jid, "⚠️ Could not fetch repository details.", { quoted: m });
    }
  }
);
