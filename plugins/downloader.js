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

        const searchRes = await getJson(`https://oggy-api.vercel.app/xnxx?search=${encodeURIComponent(query)}`);
        const firstResult = searchRes?.result?.result?.[0];
        if (!firstResult?.link) return await m.reply("No results found.");

        await react(m, "⬇️");

        const videoData = await getJson(`https://oggy-api.vercel.app/dxnxx?url=${firstResult.link}`);
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
    pattern: "pinterest",
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

        const result = await getJson(`https://oggy-api.vercel.app/pin?url=${url}`);
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

// Spotify Command
command({
  pattern: "spotify ?(.*)",
  fromMe: isPrivate,
  desc: "Download Spotify track by URL or search query",
  type: "downloader",
}, async (message, match) => {
  const input = match?.trim();

  if (!input) {
    await react(message, "❌");
    return await message.reply("❌ *Please provide a song name or Spotify track URL.*");
  }

  await react(message, "🔍");

  try {
    let trackUrl = input;

    // If not a URL, treat as search query
    if (!input.includes("spotify.com/track/")) {
      const searchRes = await axios.get(`https://oggy-api.vercel.app/spotify?search=${encodeURIComponent(input)}`);
      const tracks = searchRes.data?.data;

      if (!tracks || tracks.length === 0) {
        await react(message, "❌");
        return await message.reply("❌ No matching Spotify songs found.");
      }

      trackUrl = tracks[0].link; // Take the first result
    }

    // Download the track
    const downloadRes = await axios.get(`https://oggy-api.vercel.app/dspotify?url=${encodeURIComponent(trackUrl)}`);
    const song = downloadRes.data?.data;

    if (!downloadRes.data.status || !song?.download) {
      await react(message, "❌");
      return await message.reply("❌ Could not download the track. Try another one.");
    }

    await react(message, "⬇️");

    await message.sendFromUrl(song.download, {
      mimetype: "audio/mpeg",
      fileName: `${song.title}.mp3`,
      quoted: message,
      caption: `🎶 *${song.title}*\n👤 ${song.artis}`
    });

    await react(message, "✅");

  } catch (err) {
    console.error("Spotify command error:", err.message);
    await react(message, "❌");
    await message.reply("❌ Failed to process your request.");
  }
});

// Play ccommand
command({
  pattern: "play ?(.*)",
  fromMe: isPrivate,
  desc: "Auto-download first matching Spotify song",
  type: "downloader",
}, async (message, match) => {
  const query = match?.trim();
  if (!query) {
    await react(message, "❌");
    return await message.reply("❌ *Please provide a song name to play.*");
  }

  await react(message, "🔍");

  try {
    const searchRes = await axios.get(`https://oggy-api.vercel.app/spotify?search=${encodeURIComponent(query)}`);
    const tracks = searchRes.data?.data;

    if (!tracks || tracks.length === 0) {
      await react(message, "❌");
      return await message.reply("❌ No matching Spotify songs found.");
    }

    const firstTrack = tracks[0];
    const downloadRes = await axios.get(`https://oggy-api.vercel.app/dspotify?url=${encodeURIComponent(firstTrack.link)}`);
    const song = downloadRes.data?.data;

    if (!song || !song.download) {
      await react(message, "❌");
      return await message.reply("❌ Could not download the song. Try another.");
    }

    await react(message, "⬇️");
    await message.sendFromUrl(song.download, {
      mimetype: "audio/mpeg",
      fileName: `${song.title}.mp3`,
      quoted: message,
      caption: `🎶 *${song.title}*\n👤 ${song.artis}`
    });

    await react(message, "✅");

  } catch (err) {
    console.error("Play error:", err.message);
    await react(message, "❌");
    await message.reply("❌ Failed to fetch or download the song.");
  }
});

// Song command
command({
  pattern: "Song ?(.*)",
  fromMe: isPrivate,
  desc: "Search and play a song from Spotify",
  type: "downloader",
}, async (message, match) => {
  const input = match?.trim();
  const userId = message.sender;

  if (!input) {
    await react(message, "❌");
    return await message.reply("❌ *Please enter a song name or index to play.*", { quoted: message });
  }

  if (!isNaN(input)) {
    const index = parseInt(input) - 1;
    const tracks = searchCache[userId];

    if (!tracks || !tracks[index]) {
      await react(message, "❌");
      return await message.reply("❌ No previous search results found or invalid index.", { quoted: message });
    }

    const track = tracks[index];

    try {
      await react(message, "⬇️");
      await message.reply(`⬇️ Downloading *${track.name}* by *${track.artists}*...`, { quoted: message });

      let song = track.downloadData;
      if (!song) {
        const res = await axios.get(`https://oggy-api.vercel.app/dspotify?url=${encodeURIComponent(track.link)}`);
        const data = res.data;

        if (!data || data.status !== true || !data.data?.download) {
          await react(message, "❌");
          return await message.reply("❌ Could not download this track. Try another one.", { quoted: message });
        }

        song = data.data;
        track.downloadData = song;
      }

      await message.sendFromUrl(song.download, {
        mimetype: "audio/mpeg",
        fileName: `${song.title}.mp3`,
        quoted: message,
        caption: `🎶 *${song.title}*\n👤 ${song.artists}`
      });

      await react(message, "✅");

    } catch (err) {
      console.error("Download error:", err.message);
      await react(message, "❌");
      await message.reply("❌ Error downloading the track.", { quoted: message });
    }

  } else {
    try {
      // React with searching emoji
      await react(message, "🔍");

      const res = await axios.get(`https://oggy-api.vercel.app/spotify?search=${encodeURIComponent(input)}`);
      const allTracks = res.data.data || [];
      const filteredTracks = allTracks.filter(t => [1, 2, 5].includes(t.index));

      if (filteredTracks.length === 0) {
        await react(message, "❌");
        return await message.reply("❌ No matching indexed Spotify tracks found.", { quoted: message });
      }

      // Fetch all download links in parallel
      const results = await Promise.all(filteredTracks.map(async track => {
        try {
          const dlRes = await axios.get(`https://oggy-api.vercel.app/dspotify?url=${encodeURIComponent(track.link)}`);
          const dlData = dlRes.data;
          return {
            ...track,
            downloadData: dlData.status === true ? dlData.data : null
          };
        } catch {
          return { ...track, downloadData: null };
        }
      }));

      // Cache the results for the user
      searchCache[userId] = results;

      let msg = `🎧 *Spotify Results (Index 1, 2 & 5) for:* ${input}\n\n`;
      results.forEach((track, i) => {
        msg += `*${i + 1}. ${track.name}*\n`;
        msg += `👤 ${track.artists}\n`;
        msg += `🔗 ${track.link}\n`;
        msg += track.downloadData
          ? `📥 _Use_ \`.song ${i + 1}\` _to download this track._\n\n`
          : `⚠️ _This track cannot be downloaded._\n\n`;
      });

      // Remove the searching emoji and send the results
      await react(message, "✅");
      await message.reply(msg, { quoted: message });

    } catch (err) {
      console.error("Search error:", err.message);
      await react(message, "❌");
      await message.reply("❌ Error fetching results from Spotify.", { quoted: message });
    }
  }
});
