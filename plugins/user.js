const plugins = require("../lib/event");
const {
    command,
    isPrivate,
    clockString,
    getUrl,
    parsedJid,
    runtime,
    isAdmin
    
} = require("../lib");
const {
    BOT_INFO
} = require("../config");
const config = require("../config");
const { tiny } = require("../lib/fancy_font/fancy");
const Jimp = require("jimp");
const got = require("got");
const fs = require("fs");
const { PluginDB, installPlugin } = require("../lib/database/plugins");

command(
  {
    pattern: "ping$",
    fromMe: isPrivate,
    desc: "To check ping",
    type: "user",
  },
  async (message, match, client) => {
    // React with 📡 emoji
    if (typeof message.react === "function") {
      await message.react("📡");
    } else if (typeof message.sendReaction === "function") {
      await message.sendReaction("📡");
    } else {
      try {
        await message.client.sendMessage(message.chat || message.jid, {
          react: { text: "📡", key: message.key }
        });
      } catch (e) {
        console.error("Failed to send reaction:", e.message);
      }
    }

    const start = new Date().getTime();
    await message.sendMessage(`*❬ 𝙲𝙷𝙴𝙲𝙺𝙸𝙽𝙶 𝙻𝙰𝚃𝙴𝙽𝙲𝚈 ❭*`);
    const end = new Date().getTime();
    const speed = end - start;

    const contentText = `*𝙻𝙰𝚃𝙴𝙽𝙲𝚈!* 📡\n${speed} *𝙼𝚂*`;

    // Reply to user with verified style
    return await message.client.sendMessage(message.jid, {
      text: contentText,
      contextInfo: {
        mentionedJid: [message.sender],
        externalAdReply: {
          title: "𝚀𝚄𝙴𝙴𝙽-𝙽𝙴𝚉𝚄𝙺𝙾",
          body: "⬇️ 𝙿𝙸𝙽𝙶 𝚁𝙴𝚂𝚄𝙻𝚃",
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: false,
          thumbnailUrl: "https://files.catbox.moe/v5y6d8.png",
          sourceUrl: "https://github.com/Godzenox00/NEZUKO-MD"
        }
      }
    }, { quoted: message }); // <== This makes it a REPLY
  }
);

/* Copyright (C) 2022 X-Electra.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
X-Asena - X-Electra
*/


command(
  {
    pattern: "pp$",
    fromMe: true,
    desc: "Set full screen profile picture",
    type: "user",
  },
  async (message, match,m) => {
    if (!message.reply_message.image)
      return await message.reply("*_ʀᴇᴩʟᴀʏ ᴛᴏ ᴀ ɪᴍᴀɢᴇ_*");
    let media = await m.quoted.download();
    await updateProfilePicture(message.user, media, message);
    return await message.reply("*_ᴩʀᴏꜰɪʟᴇ ᴩɪᴄᴛᴜʀᴇ ᴜᴩᴅᴀᴛᴇᴅ_*");
  }
);

async function updateProfilePicture(jid, imag, message) {
  const { query } = message.client;
  const { img } = await generateProfilePicture(imag);
  await query({
    tag: "iq",
    attrs: {
      to: jid,
      type: "set",
      xmlns: "w:profile:picture",
    },
    content: [
      {
        tag: "picture",
        attrs: { type: "image" },
        content: img,
      },
    ],
  });
}

async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}



command(
  {
    pattern: "block",
    fromMe: true,
    desc: "Block a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("*_Need a number/reply/mention!_*");
      await message.block(jid);
      return await message.sendMessageMessage(`_@${jid.split("@")[0]} ʙʟᴏᴄᴋᴇᴅ_`, {
        mentions: [jid],
      });
    } else {
      await message.block(message.jid);
      return await message.reply("_User blocked_");
    }
  }
);


command(
  {
    pattern: "unblock",
    fromMe: true,
    desc: "Unblock a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("*_Need a number/reply/mention!_*");
      await message.block(jid);
      return await message.sendMessage(`*_@${jid.split("@")[0]} unblocked_*`, {
        mentions: [jid],
      });
    } else {
      await message.unblock(message.jid);
      return await message.reply("*_User unblocked_*");
    }
  }
);


command(
  {
    pattern: "jid",
    fromMe: true,
    desc: "Give jid of chat/user",
    type: "user",
  },
  async (message, match) => {
    return await message.sendMessage(
      message.mention[0] || message.reply_message.jid || message.jid
    );
  }
);



command(
  {
    pattern: "dlt$",
    fromMe: true,
    desc: "deletes a message",
    type: "user",
  },
  async (message, match,m,client) => {
    if (!message.reply_message) return await message.reply("*_Reply to a message_*"); {
      await client.sendMessage(message.jid, { delete: message.reply_message.key })
    }
  }
);



command(
  {
    pattern: "list",
    fromMe: isPrivate,
    desc: "Show All Commands",
    type: "user",
    dontAddCommandList: true,
  },
  async (message, match, { prefix }) => {
    let menu = `╭──────────────────┈⊷`;
    menu += `\n│\n`;

    let cmnd = [];
    let cmd, desc;
    plugins.commands.map((command) => {
      if (command.pattern) {
        cmd = command.pattern.toString().split(/\W+/)[1];
      }
      desc = command.desc || false;

      if (!command.dontAddCommandList && cmd !== undefined) {
        cmnd.push({ cmd, desc });
      }
    });
    cmnd.sort();
    cmnd.forEach(({ cmd, desc }, num) => {
      menu += `│  ${(num += 1)}. *${cmd.trim()}*`;
      if (desc) menu += `\n│  Use: \`\`\`${desc}\`\`\``;
      menu += `\n│\n`;
    });
    menu += `╰──────────────────┈⊷`;
    return await message.reply(message.jid, { text: (tiny(menu)) })
})


command(
  {
    pattern: "plugin ?(.*)",
    fromMe: true,
    desc: "Install External plugins",
    type:'user'
  },
  async (message, match) => {
    if (!match) return await message.sendMessage("*_Send a plugin url_*");
    for (let Url of getUrl(match)) {
      try {
        var url = new URL(Url);
      } catch {
        return await message.sendMessage("*_Invalid Url_*");
      }

      if (url.host === "gist.github.com") {
        url.host = "gist.githubusercontent.com";
        url = url.toString() + "/raw";
      } else {
        url = url.toString();
      }
      var plugin_name;
      var response = await got(url);
      if (response.statusCode == 200) {
        var commands = response.body
          .match(/(?<=pattern:)(.*)(?=\?(.*))/g)
          .map((a) => a.trim().replace(/"|'|`/, ""));
        plugin_name =
          commands[0] ||
          plugin_name[1] ||
          "__" + Math.random().toString(36).substring(8);

        fs.writeFileSync("./plugins/" + plugin_name + ".js", response.body);
        try {
          require("./" + plugin_name);
        } catch (e) {
          fs.unlinkSync("/xasena/plugins/" + plugin_name + ".js");
          return await message.sendMessage("*_Invalid Plugin_*\n ```" + e + "```");
        }

        await installPlugin(url, plugin_name);

        await message.sendMessage(
          `*_New plugin installed : ${commands.join(",")}_*`
        );
      }
    }
  }
);



command(
  { 
      pattern: "pluglist", 
      fromMe: true, 
      desc: "plugin list",
      type:'user'},
  async (message, match) => {
    var mesaj = "";
    var plugins = await PluginDB.findAll();
    if (plugins.length < 1) {
      return await message.sendMessage("*_No external plugins installed_*");
    } else {
      plugins.map((plugin) => {
        mesaj +=
          "```" +
          plugin.dataValues.name +
          "```: " +
          plugin.dataValues.url +
          "\n";
      });
      return await message.sendMessage(mesaj);
    }
  }
);



command(
  {
    pattern: "remove(?: |$)(.*)",
    fromMe: true,
    desc: "Remove external plugins",
    type:'user'
  },
  async (message, match) => {
    if (!match) return await message.sendMessage("*_Need a plugin name_*");

    var plugin = await PluginDB.findAll({ where: { name: match } });

    if (plugin.length < 1) {
      return await message.sendMessage("*_Plugin not found_*");
    } else {
      await plugin[0].destroy();
      delete require.cache[require.resolve("./" + match + ".js")];
      fs.unlinkSync("./plugins/" + match + ".js");
      await message.sendMessage(`*_Plugin ${match} Deleted, Restart_*`);
    }
  }
);


command(
    {
	pattern: 'setbio(.*)',
	fromMe: true,
	desc: 'to change your profile status',
	type: 'user'
}, async (message, match) => {
	match = match || message.reply_message.text
	if (!match) return await message.reply('*_Need Text_!*\n *Example: setbio _NEZUKO MD_*.')
	await message.client.updateProfileStatus(match)
	await message.reply('*_Successfully bio updated_*')
})

command({
        pattern: "runtime", 
        fromMe: isPrivate,
        desc: "Bot Runtime", 
        type: "user",
    }, async (msg, match ) => {
let run = runtime(process.uptime())

await msg.reply(`*_Runtime: ${run}_*`)
});
