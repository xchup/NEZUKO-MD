const { command, webp2mp4, isPrivate, AddMp3Meta, getBuffer, qrcode, isUrl } = require("../lib/");
const gis = require("g-i-s");
const jimp = require("jimp");
const QRReader = require("qrcode-reader");
let { unlink } = require("fs/promises");
const got = require("got");
const FormData = require("form-data");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);
const fs = require("fs");
const googleTTS = require('google-tts-api');
const X = require("../config");
const { CAPTION, AUDIO_DATA } = require("../config");
const { toPTT } = require("../lib/media");
const { downloadMediaMessage } = require('@whiskeysockets/baileys');


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

// Utility functions (getJson, sleep)
const getJson = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. Command to handle uploading media from raw URL
command(
  {
    pattern: "upload",
    fromMe: isPrivate,
    desc: "Downloads & uploads media from raw URL",
    type: "tool",
  },
  async (m, match) => {
    match = match || m.quoted?.text;
    if (!match) {
      await react(m, "❌");
      return m.reply("*_Need an imgur/graph link_*");
    }

    let uploadSuccess = false;

    await react(m, "♻️");

    const uploadTimer = setTimeout(async () => {
      if (!uploadSuccess) {
        await react(m, "⏫");
      }
    }, 2000);

    try {
      await m.sendFromUrl(match, {}, { quoted: m });
      uploadSuccess = true;
      await react(m, "✅");
    } catch (err) {
      clearTimeout(uploadTimer);
      console.error("Upload error:", err.message);
      await react(m, "❌");
      await m.reply("Failed to upload media.");
    }
  }
);

// 2. Command to handle sticker EXIF data
command(
  {
    pattern: "exif",
    fromMe: true,
    desc: "Extracts Exif data from stickers",
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message || !message.reply_message.sticker)
      return await message.reply("*_Reply to sticker_*");
    let img = new Image();
    await img.load(await m.quoted.download());
    const exif = JSON.parse(img.exif.slice(22).toString());
    await message.reply(exif);
  }
);

// 3. Command to handle Telegram sticker download
command(
  {
    pattern: "tgs",
    fromMe: isPrivate,
    desc: "Download Sticker From Telegram",
    type: "converter",
  },
  async (message, match) => {
    if (!match)
      return message.reply(
        "*_Enter a tg sticker url_*\n*_Eg: https://t.me/addstickers/Oldboyfinal\nKeep in mind that there is a chance of ban if used frequently_*"
      );
    let packid = match.split("/addstickers/")[1];
    let { result } = await getJson(
      `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(
        packid
      )}`
    );
    if (result.is_animated)
      return message.reply("*_Animated stickers are not supported_*");
    message.reply(
      `*_Total stickers :_* ${result.stickers.length}\n*_Estimated complete in:_* ${
        result.stickers.length * 1.5
      } seconds`.trim()
    );
    for (let sticker of result.stickers) {
      let file_path = await getJson(
        `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${sticker.file_id}`
      );
      await message.sendMessage(
        `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${file_path.result.file_path}`,
        { packname: CAPTION.split(";")[0], author: CAPTION.split(";")[1] },
        "sticker"
      );
      sleep(1500);
    }
  }
);

// 4. Command to convert media to sticker
command(
  {
    pattern: "sticker",
    fromMe: isPrivate,
    desc: "Converts Photo or video to sticker",
    type: "converter",
  },
  async (message, match, m) => {
    if (!(message.reply_message.video || message.reply_message.image))
      return await message.reply("*_Reply to photo or video!_*");
    let buff = await m.quoted.download();
    message.sendMessage(
      buff,
      { packname: CAPTION.split(";")[0], author: CAPTION.split(";")[1], contextInfo: { externalAdReply: {
title: "𝐍𝐄𝐙𝐔𝐊𝐎 𝐌𝐃",
body: "𝘾𝙤𝙣𝙫𝙚𝙧𝙩𝙚𝙙 𝙄𝙣𝙩𝙤 𝙎𝙩𝙞𝙘𝙠𝙚𝙧",
sourceUrl: "",
mediaUrl: "",
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: false,
thumbnailUrl: "https://i.imgur.com/imOAWEN.jpeg" }} },
      "sticker"
    );
  }
);

// 5. Command to change EXIF data of stickers
command(
  {
    pattern: "take",
    fromMe: isPrivate,
    desc: "Changes Exif data of stickers",
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message || !message.reply_message.sticker)
      return await message.reply("*_Reply to sticker_*");
    let buff = await m.quoted.download();
    let [packname, author] = match.split(",");
    await message.sendMessage(
      buff,
      {
        packname: packname || CAPTION.split(";")[0],
        author: author || CAPTION.split(";")[1], contextInfo: { externalAdReply: {
title: "𝐍𝐄𝐙𝐔𝐊𝐎 𝐌𝐃",
body: `𝙏𝙖𝙠𝙚𝙙 𝙏𝙤 ${match}`,
sourceUrl: "",
mediaUrl: "",
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: false,
thumbnailUrl: "https://i.imgur.com/imOAWEN.jpeg" }}
      },
      "sticker"
    );
  }
);

command(
  {
    pattern: "vv",
    fromMe: isPrivate,
    desc: "anti viewOnce",
    type: "tool",
  },
  async (message, match, m) => {
    const quotedMsg = m.quoted?.message;

    if (!quotedMsg) {
      return await message.reply('*_Reply to a view-once message!_*');
    }

    // Detect supported media type directly
    const mediaMsg =
      quotedMsg.imageMessage ||
      quotedMsg.videoMessage ||
      quotedMsg.audioMessage;

    if (!mediaMsg || !mediaMsg.viewOnce) {
      return await message.reply('*_Reply to a view-once message!_*');
    }

    try {
      const media = await downloadMediaMessage(
        { message: quotedMsg },
        'buffer',
        {},
        { reuploadRequest: message.client.updateMediaMessage }
      );

      const mimeType =
        mediaMsg.mimetype ||
        mediaMsg?.imageMessage?.mimetype ||
        mediaMsg?.videoMessage?.mimetype;

      if (mimeType?.startsWith('image/')) {
        await message.sendFile(media, 'viewonce.jpg', '', message);
      } else if (mimeType?.startsWith('video/')) {
        await message.sendFile(media, 'viewonce.mp4', '', message);
      } else if (mimeType?.startsWith('audio/')) {
        await message.client.sendMessage(
          message.jid,
          { audio: media, mimetype: "audio/mpeg", ptt: true },
          { quoted: message }
        );
      } else {
        await message.sendFile(media, 'viewonce.bin', '', message);
      }
    } catch (err) {
      await message.reply(`❌ Failed to download view-once media:\n*${err.message}*`);
    }
  }
);


command(
  {
    pattern: "tts",
    fromMe: isPrivate,
    desc: "text to speech",
    type: "converter",
  },
  async (message, match, m) => {
if (!match) return await message.reply(`*_Need Text!_*
*_Example: tts Hello_*
*_tts Hello :en_*`);
            let [txt,lang] = match.split`:`
            const audio = googleTTS.getAudioUrl(`${txt}`, {
                lang: lang || "en-US",
                slow: false,
                host: "https://translate.google.com",
            })
            message.client.sendMessage(message.jid, {
                audio: {
                    url: audio,
                },
                mimetype: 'audio/mpeg',
                ptt: true,
            }, {
                quoted: message,
            })
  }
  );

command(
  {
    pattern: "qr",
    fromMe: isPrivate,
    desc: "Read/Write Qr.",
    type: "converter",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (match) {
      let buff = await qrcode(match);
      return await message.sendMessage(buff, {}, "image");
    } else if (!message.reply_message || !message.reply_message.image)
      return await message.sendMessage(
        "*Example : qr test*\n*Reply to a qr image.*"
      );

    const { bitmap } = await jimp.read(
      await message.reply_message.downloadMediaMessage()
    );
    const qr = new QRReader();
    qr.cvideosback = (err, value) =>
      message.sendMessage(err ?? value.result, { quoted: message.data });
    qr.decode(bitmap);
  }
);
