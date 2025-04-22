const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { command, isPrivate, blackVideo } = require("../lib");
const GITHUB_TOKEN = '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';
const GITHUB_USERNAME = 'mksir12';
const GITHUB_REPO = 'jerryapii';
const GITHUB_BRANCH = 'main';
const VERCEL_DOMAIN = 'https://jerryapi.vercel.app';

function makeid(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

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

command({
  pattern: "url",
  fromMe: isPrivate,
  desc: "📤 Upload media to GitHub + Vercel (image, video, gif, or audio)",
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

    const base64Content = fs.readFileSync(filePath, { encoding: "base64" });

    const githubApiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filename}`;

    await axios.put(
      githubApiUrl,
      {
        message: `upload ${filename}`,
        content: base64Content,
        branch: GITHUB_BRANCH
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": "Zenox-uploader"
        }
      }
    );

    await react(message, "✅");
    await message.reply(`✅ *Success!*\n📂 URL: ${VERCEL_DOMAIN}/${filename}`);
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Upload Error:", error.response?.data || error.message);
    await react(message, "❌");
    await message.reply(`❌ *Error:* ${error.response?.data?.message || error.message}`);
  }
});

// credits to oggy @, mksir12
// copyright nezuko 2025
