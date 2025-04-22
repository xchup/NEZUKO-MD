const axios = require("axios");

// Get video metadata from tomp3.cc
const ytdlget = async (url) => {
  try {
    const data = "query=" + encodeURIComponent(url);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://tomp3.cc/api/ajax/search",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      data,
    };

    const response = await axios.request(config);
    if (!response.data || !response.data.links) {
      throw new Error("Invalid or unexpected response from server.");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching video metadata:", error.message);
    throw new Error("Failed to fetch YouTube metadata.");
  }
};

// Format available download options
function formatYtdata(data, options = {}) {
  const { type, quality } = options;
  const formatted_data = [];

  const processFormat = (format) => {
    if (!format) return;
    formatted_data.push({
      vid: data.vid,
      id: format.k,
      size: format.size,
      quality: format.q,
      type: format.f,
    });
  };

  if (data.links?.mp4) Object.values(data.links.mp4).forEach(processFormat);
  processFormat(data.links?.mp3?.mp3128);
  processFormat(data.links?.["3gp"]?.["3gp@144p"]);

  let filtered = formatted_data;
  if (type || quality) {
    filtered = formatted_data.filter(
      (item) =>
        (!type || item.type === type) &&
        (!quality || item.quality === quality)
    );
  }

  return filtered;
}

// Get final downloadable link using video id and format key
async function ytdlDl(vid, k) {
  try {
    const data = `vid=${vid}&k=${encodeURIComponent(k)}`;
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://tomp3.cc/api/ajax/convert",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      data,
    };

    const response = await axios.request(config);
    if (!response.data || !response.data.url) {
      throw new Error("Failed to get download URL from response.");
    }

    return response.data;
  } catch (error) {
    console.error("Download conversion error:", error.message);
    throw new Error("Failed to convert and fetch download URL.");
  }
}

// Main audio downloader function
async function yta(url) {
  const data = await ytdlget(url);
  const formats = formatYtdata(data, { type: "mp3" });

  if (!formats.length) throw new Error("No MP3 formats found for this video.");

  const { id, vid, size } = formats[0];
  const response = await ytdlDl(vid, id);

  return {
    ...response,
    sizes: size,
    thumb: `https://i.ytimg.com/vi/${vid}/0.jpg`,
  };
}

// Main video downloader function
async function ytv(url, quality = "480p") {
  const data = await ytdlget(url);
  const formats = formatYtdata(data, { type: "mp4", quality });

  if (!formats.length) throw new Error(`No MP4 format found for quality "${quality}".`);

  const { id, vid, size } = formats[0];
  const response = await ytdlDl(vid, id);

  return {
    ...response,
    sizes: size,
    thumb: `https://i.ytimg.com/vi/${vid}/0.jpg`,
  };
}

module.exports = {
  yta,
  ytv,
  ytdlDl,
  ytdlget,
  formatYtdata,
};
