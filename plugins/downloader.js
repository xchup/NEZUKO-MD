const { command, isPrivate } = require("../lib");
const axios = require("axios");

// Custom react function
const react = async (msg, emoji) => {
  if (typeof msg.react === "function") {
    await msg.react(emoji);
  } else if (typeof msg.sendReaction === "function") {
    await msg.sendReaction(emoji); // for some custom bot frameworks
  } else {
    try {
      await msg.client.sendMessage(msg.chat || msg.jid, {
        react: { text: emoji, key: msg.key }
      });
    } catch (e) {
      console.error("Failed to send reaction:", e.message);
    }
  }
};

// Function to validate Instagram URLs
const isValidInstaUrl = (url) => {
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_\-]+/.test(url);
};

// Instagram media downloader
command(
  {
    pattern: "insta",
    fromMe: isPrivate,
    desc: "Instagram media downloader - download images and videos from Instagram",
    type: "downloader"
  },
  async (message, match, client) => {
    const url = match || message.quoted?.text;
    if (!url) {
      await react(message, "⚠️");
      return await message.reply("❌ *Please provide a valid Instagram URL.*");
    }

    if (!isValidInstaUrl(url)) {
      await react(message, "⚠️");
      return await message.reply("❌ *Invalid Instagram URL format.*");
    }

    await react(message, "♻️");

    try {
      const res = await axios.get(
        `https://oggy-api.vercel.app/insta?url=${encodeURIComponent(url)}`,
        {
          timeout: 10000,
          headers: {
            "User-Agent": "ZenoxBot/1.0"
          }
        }
      );

      const data = res.data?.data;

      if (!data || data.length === 0) {
        await react(message, "❌");
        return await message.reply("⚠️ *No media found or the post may be private.*");
      }

      const supportedTypes = ["image", "video"];

      for (const media of data) {
        if (!supportedTypes.includes(media.type)) {
          continue;
        }

        await message.sendFromUrl(media.url, {
          quoted: message,
          type: media.type
        });
      }

      await react(message, "✅");
    } catch (error) {
      console.error("Instagram Download Error:", error.response?.data || error.message);
      await react(message, "❌");
      await message.reply("❌ *Failed to download from Instagram. Please try again later.*");
    }
  }
);

// Function to get JSON data
async function getJson(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        throw new Error("API error");
    }
}

// MAIN COMMANDS
// XNXX Command
command({
    pattern: "xnxx",
    fromMe: isPrivate,
    desc: "Download media from XNXX by search or URL",
    type: "downloader",
}, async (m, text, client) => {
    try {
        const query = text || m.quoted?.text;
        if (!query) {
            await react(m, "💀");
            return await m.reply("Please enter a search term or URL.");
        }

        await react(m, "🔎");

        const searchRes = await getJson(`https://api-aswin-sparky.koyeb.app/api/search/xnxx?search=${encodeURIComponent(query)}`);
        const firstResult = searchRes?.result?.result?.[0];
        if (!firstResult?.link) return await m.reply("No results found.");

        await react(m, "⬇️");

        const videoData = await getJson(`https://api-aswin-sparky.koyeb.app/api/downloader/xnxx?url=${firstResult.link}`);
        const videoUrl = videoData?.data?.files?.high;
        const title = videoData?.data?.title;

        if (!videoUrl) return await m.reply("Failed to get download link.");

        await m.sendFromUrl(videoUrl, { caption: title || "Downloaded from XNXX" });
        await react(m, "✅");
    } catch (err) {
        console.error("XNXX Error:", err);
        await react(m, "❌");
        await m.reply("Failed to download the video.");
    }
});

// Pinterest Command
command({
    pattern: "pintrest",
    fromMe: isPrivate,
    desc: "Download images and content from Pinterest",
    type: "downloader",
}, async (m, text, client) => {
    try {
        const url = text || m.quoted?.text;
        if (!url) {
            await react(m, "❌");
            return await m.reply("Please provide a Pinterest URL.");
        }

        await react(m, "⬇️");

        const result = await getJson(`https://api-aswin-sparky.koyeb.app/api/downloader/pin?url=${url}`);
        await m.sendFromUrl(result.data.url, { caption: result.data.created_at });

        await react(m, "✅");
    } catch (err) {
        console.error("Pinterest Error:", err);
        await react(m, "❌");
        await m.reply("Failed to download content from Pinterest.");
    }
});

// Facebook Command
command({
    pattern: "fb",
    fromMe: isPrivate,
    desc: "Download videos from Facebook by URL",
    type: "downloader",
}, async (m, text, client) => {
    try {
        const url = text || m.quoted?.text;
        if (!url) {
            await react(m, "❌");
            return await m.reply("Please provide a Facebook video URL.");
        }

        await react(m, "⬇️");

        const data = await getJson(`https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${url}`);
        await m.sendFromUrl(data.data.high, { caption: data.data.title });

        await react(m, "✅");
    } catch (err) {
        console.error("Facebook Error:", err);
        await react(m, "❌");
        await m.reply("Failed to download the Facebook video.");
    }
});
