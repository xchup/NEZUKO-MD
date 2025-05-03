const { command, isPrivate } = require("../lib");
const axios = require("axios");

// Custom react function
const react = async (msg, emoji) => {
  if (typeof msg.react === "function") {
    await msg.react(emoji);
  } else if (typeof msg.sendReaction === "function") {
    await msg.sendReaction(emoji);
  } else {
    try {
      await msg.client.sendMessage(msg.chat || msg.jid, {
        react: { text: emoji, key: msg.key },
      });
    } catch (e) {
      console.error("Failed to send reaction:", e.message);
    }
  }
};

command(
  {
    pattern: "pp",
    fromMe: true,
    desc: "Set profile picture",
    type: "user",
  },
  async (message, match, m) => {
    try {
      if (!message.reply_message || !message.reply_message.image) {
        await react(message, "❌");
        return await message.reply("_Reply to a photo_");
      }

      let buff = await m.quoted.download();
    await message.setPP(message.user, buff);
      await react(message, "✅");
      return await message.reply("_Profile Picture Updated_");
    } catch (err) {
      console.error("Error updating profile picture:", err);
      await react(message, "⚠️");
      return await message.reply("_Failed to update profile picture_");
    }
  }
);
