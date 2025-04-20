const {
  Function,
  isPrivate,
  getUrl,
  fromBuffer,
  Imgur,
  getBuffer,
  getJson,
  Fancy,
  AddMp3Meta,
  createMap,
  formatBytes,
  parseJid,
  isUrl,
  parsedJid,
  pinterest,
  wallpaper,
  wikimedia,
  quotesAnime,
  aiovideodl,
  umma,
  ringtone,
  styletext,
  FileSize,
  h2k,
  textpro,
  yt,
  ytIdRegex,
  yta,
  ytv,
  runtime,
  clockString,
  sleep,
  jsonformat,
  Serialize,
  processTime,
  command,
} = require("../lib/");
const util = require("util");
const config = require("../config");

command({
  pattern: 'eval',
  on: "text",
  fromMe: true,
  desc: 'Runs a server code'
}, async (message, match, m, client) => {
  if (match.startsWith("$")) {
    try {
      let result = await eval(match.slice(1).trim());
      if (typeof result !== "string") {
        result = require("util").inspect(result, { depth: 0 });
      }
      await message.reply("```js\n" + result + "\n```");
    } catch (err) {
      await message.reply("❌ Error:\n" + util.format(err));
    }
  }
});
