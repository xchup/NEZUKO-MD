const plugins = require("../lib/event");
const {
  command,
  isPrivate,
  clockString,
  getUrl,
  parsedJid,
  isAdmin
} = require("../lib");
const { BOT_INFO } = require("../config");
const config = require("../config");
const axios = require("axios");
const { tiny } = require("../lib/fancy_font/fancy");
const fs = require("fs");
const { PluginDB, installPlugin } = require("../lib/database/plugins");

command(
  {
    pattern: "menu",
    fromMe: isPrivate,
    desc: "Show All Commands",
    dontAddCommandList: true,
    type: "user",
  },
  async (message, match, m, client) => {
    try {
      const react = async (msg, emoji) => {
        if (typeof msg.react === "function") {
          await msg.react(emoji);
        } else if (typeof msg.sendReaction === "function") {
          await msg.sendReaction(emoji);
        } else {
          try {
            await msg.client.sendMessage(msg.chat || msg.jid, {
              react: { text: emoji, key: msg.key }
            });
          } catch (e) {
            console.error("Reaction error:", e.message);
          }
        }
      };

      await react(message, "📄");

      if (match) {
        for (let i of plugins.commands) {
          if (
            i.pattern instanceof RegExp &&
            i.pattern.test(message.prefix + match)
          ) {
            const cmdName = i.pattern.toString().split(/\W+/)[1];
            return await message.reply(`\`\`\`Command: ${message.prefix}${cmdName.trim()}
Description: ${i.desc}\`\`\``);
          }
        }
      } else {
        let { prefix } = message;
        let [date, time] = new Date()
          .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          .split(",");
        let usern = message.pushName;
        const readMore = String.fromCharCode(8206).repeat(4001);
        let menu = `\n╭───〔 ${BOT_INFO.split(";")[0]} 〕──┈⊷
  ╭────────────────⊷   
  ┃✯│ 𝙾𝚆𝙽𝙴𝚁: ${BOT_INFO.split(";")[1]}
  ┃✯│ 𝚄𝚂𝙴𝚁: ${usern}
  ┃✯│ 𝙳𝙰𝚃𝙴: ${date}
  ┃✯│ 𝚃𝙸𝙼𝙴: ${time}
  ┃✯│ 𝙿𝙻𝚄𝙶𝙸𝙽𝚂: ${plugins.commands.length}
  ┃✯│ 𝙼𝙾𝙳𝙴: ${config.WORK_TYPE}
  ┃✯│ 𝙷𝙰𝙽𝙳𝙻𝙴𝚁: ${config.HANDLERS}
  ┃✯│ 𝚅𝙴𝚁𝚂𝙸𝙾𝙽: ${require("../package.json").version}
  ╰─────────────────⊷  
‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎ ⎙‎ 𝙿𝙻𝚄𝙶𝙸𝙽𝚂 ⎙‎ `;

        let cmnd = [];
        let cmd;
        let category = [];
        plugins.commands.map((command, num) => {
          if (command.pattern instanceof RegExp) {
            cmd = command.pattern.toString().split(/\W+/)[1];
          }

          if (!command.dontAddCommandList && cmd !== undefined) {
            let type = command.type ? command.type.toLowerCase() : "misc";
            cmnd.push({ cmd, type });
            if (!category.includes(type)) category.push(type);
          }
        });

        cmnd.sort();
        category.sort().forEach((cmmd) => {
          menu += `\n   ╭─────────────┈⊷`;
          menu += `\n   │ꀆ  *${cmmd.toUpperCase()}* ꀆ`;
          menu += `\n   ╰─────────────┈⊷`;
          menu += `\n  ╭─────────────┈⊷`;
          let comad = cmnd.filter(({ type }) => type == cmmd);
          comad.forEach(({ cmd }) => {
            menu += `\n  ││   ${cmd.trim()}`;
          });
          menu += `\n  ╰─────────────┈⊷`;
        });

        menu += `\n© 𝚀𝚄𝙴𝙴𝙽-𝙽𝙴𝚉𝚄𝙺𝙾`;
        let penu = tiny(menu);

        let thumbnailBuffer = await axios
          .get("https://jerryapi.vercel.app/Fs97Yu.jpg", {
            responseType: "arraybuffer",
          })
          .then((res) => res.data)
          .catch(() => null);

        return await message.client.sendMessage(
          message.jid,
          {
            text: penu,
            contextInfo: {
              externalAdReply: {
                title: "𝚀𝚄𝙴𝙴𝙽-𝙽𝙴𝚉𝚄𝙺𝙾",
                body: "⬇️ 𝙼𝙰𝙸𝙽 𝙼𝙴𝙽𝚄",
                mediaType: 1,
                renderLargerThumbnail: false,
                showAdAttribution: true,
                thumbnail: thumbnailBuffer,
              },
            },
          },
          { quoted: message }
        );
      }
    } catch (e) {
      message.reply(e.toString());
    }
  }
);
