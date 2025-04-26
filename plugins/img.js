const {
  command,
  isPrivate,
} = require("../lib/");
const gis = require("g-i-s");

command(
  {
    pattern: "img",
    fromMe: isPrivate,
    desc: "Google Image search",
    type: "downloader",
  },
  async (message, match) => {
    if (!match) {
      return await message.sendMessage("*_Enter Search Term,number_*");
    }

    let [query, amount] = match.split(",");
    amount = parseInt(amount) || 5;

    try {
      let result = await gimage(query, amount);

      if (!result || result.length === 0) {
        return await message.sendMessage(`*_No images found for "${query}"_*`);
      }

      await message.sendMessage(`*_Downloading ${result.length} images for "${query}"..._*`);

      for (let url of result) {
        if (!url) continue;
        try {
          await message.sendFromUrl(url);
        } catch (err) {
          console.error(`Failed to send image from ${url}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error("Image fetch error:", err.message);
      await message.sendMessage("*_Error fetching images. Please try again later._*");
    }
  }
);

async function gimage(query, amount = 5) {
  return new Promise((resolve, reject) => {
    gis(query, (error, results) => {
      if (error) return reject(error);

      const list = [];
      for (let i = 0; i < Math.min(results.length, amount); i++) {
        if (results[i] && results[i].url) {
          list.push(results[i].url);
        }
      }

      resolve(list);
    });
  });
    }
