const {
  command,
  webp2mp4,
  isPrivate,
  AddMp3Meta,
  getBuffer
} = require("../lib/");
const gis = require("g-i-s");
const googleTTS = require('google-tts-api');
const X = require("../config");
const { CAPTION, AUDIO_DATA } = require("../config");

command(
  {
    pattern: "mp4",
    fromMe: isPrivate,
    desc: "Changes sticker to Video",
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message)
      return await message.reply("*_Reply to a sticker_*");
    if (message.reply_message.mtype !== "stickerMessage")
      return await message.reply("*_Not a sticker_*");
    let buff = await m.quoted.download();
    let buffer = await webp2mp4(buff);
    return await message.sendMessage(buffer,{mimetype: 'video/mp4', caption: (X.CAPTION), quoted: message }, "video")
  }
);
