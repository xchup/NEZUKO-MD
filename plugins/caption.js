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
    pattern: "caption",
    fromMe: isPrivate,
    desc: "change video and image caption",
    type: "converter",
  },
  async (message, match, m) => {
if (!message.reply_message || (!message.reply_message.video && !message.reply_message.image)) return await message.reply('*_Reply at image/video!_*')
let res = await m.quoted.download();
      if(message.reply_message.video){
       await message.client.sendMessage(message.jid, { video :res ,  mimetype:"video/mp4", caption: (match)}, {quoted: message })
      } else if(message.reply_message.image){
      await message.client.sendMessage(message.jid, { image :res ,  mimetype:"image/jpeg", caption: (match)}, {quoted: message })
}
  }
  );
