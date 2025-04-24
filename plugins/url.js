const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { command, isPrivate } = require("../lib");

const IMAGEKIT_URL = "https://upload.imagekit.io/api/v1/files/upload";
const IMAGEKIT_PUBLIC_KEY = "public_od3PDIqh33GZ8sAOj/aDakRA6zo=";
const IMAGEKIT_PRIVATE_KEY = "private_VGQugh1MUamsvYrf6IOcLRTgeQ4=";

// Function to create random ID for file names
function makeid(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Function to react to the message
async function react(message, emoji) {
  if (message.key && message.client?.sendMessage) {
    await message.client.sendMessage(message.jid, {
      react: {
        text: emoji,
        key: message.key,
      },
    });
  }
}

// Function to remove background from video
async function blackVideo(buffer) {
  // Implement your video background removal logic here
  // For now, assuming it returns the modified video buffer (you may replace with actual logic)
  return buffer; // Placeholder: return the same buffer as it is
}

command({
  pattern: "url",
  fromMe: isPrivate,
  desc: "📤 Upload media to ImageKit (image, video, gif, or audio)",
  type: "tool"
}, async (message, match, m) => {
  const quoted = message.reply_message;

  if (!quoted) {
    await react(message, "❌");
    return message.reply("❌ *Reply to an image, video, gif, or audio first.*");
  }

  await react(message, "♻️");

  try {
    const mime = quoted.mimetype || quoted.mtype || "";

    if (!mime || (!mime.includes("image") && !mime.includes("video") && !mime.includes("audio"))) {
      await react(message, "❌");
      return message.reply("⚠️ *Reply to a valid media file (image, video, gif, or audio).*");
    }

    const raw = await m.quoted.download();
    let filename = "", filePath = "";

    if (mime.includes("audio")) {
      const videoBuffer = await blackVideo(raw);
      filename = `${makeid()}.mp4`;
      filePath = path.join(os.tmpdir(), filename);
      fs.writeFileSync(filePath, videoBuffer);
    } else if (mime.includes("video") || mime.includes("gif")) {
      filename = `${makeid()}.mp4`;
      filePath = path.join(os.tmpdir(), filename);
      fs.writeFileSync(filePath, raw);
    } else if (mime.includes("image")) {
      filename = `${makeid()}.jpg`;
      filePath = path.join(os.tmpdir(), filename);
      fs.writeFileSync(filePath, raw);
    } else {
      await react(message, "❌");
      return message.reply("⚠️ *Unsupported media type.*");
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("fileName", filename);
    form.append("publicKey", IMAGEKIT_PUBLIC_KEY);

    const res = await axios.post(IMAGEKIT_URL, form, {
      headers: form.getHeaders(),
      auth: {
        username: IMAGEKIT_PRIVATE_KEY,
        password: "",
      },
    });

    fs.unlinkSync(filePath);
    if (res.data?.url) {
      await react(message, "✅");
      await message.reply(`✅ *Uploaded!*\n🔗 URL: ${res.data.url}`);
    } else {
      await react(message, "❌");
      await message.reply("❌ *Upload failed.*");
    }
  } catch (error) {
    console.error("Upload Error:", error.response?.data || error.message);
    await react(message, "❌");
    await message.reply(`❌ *Error:* ${error.response?.data?.message || error.message}`);
  }
});

// credits to oggy @, mksir12
// copyright nezuko 2025
