const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
} = require("@whiskeysockets/baileys");
const { makeInMemoryStore } = require("@whiskeysockets/baileys");
const fs = require("fs");
const { serialize } = require("./lib/serialize");
const { Message, Image, Sticker } = require("./lib/Base");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const got = require("got");
const config = require("./config");
const credsPath = './lib/session'; // This must be a directory, not a file
const { File } = require("megajs");
const { PluginDB } = require("./lib/database/plugins");
const Greetings = require("./lib/Greetings");

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

require("events").EventEmitter.defaultMaxListeners = 500;

async function downloadSessionData() {
  if (!config.SESSION_ID) {
    console.error("Please put your session to SESSION_ID env !!");
    process.exit(1);
  }
  const Zenox = config.SESSION_ID;
  const Baabi = Zenox.replace("NeZuKo~", "");
  const Nezuko = File.fromURL(`https://mega.nz/file/${Baabi}`);
  Nezuko.download((err, data) => {
    if (err) throw err;
    if (!fs.existsSync(credsPath)) {
  fs.mkdirSync(credsPath, { recursive: true });
}
fs.writeFile(path.join(credsPath, 'creds.json'), data, () => {

      console.log("Session Saved [🌟]");
    });
  });
}

(async () => {
  if (!fs.existsSync(credsPath)) {
    await downloadSessionData();
  }
})();

fs.readdirSync("./lib/database/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() === ".js") {
    require("./lib/database/" + plugin);
  }
});

async function Abhiy() {
  console.log("Syncing Database");
  await config.DATABASE.sync();

  const { state, saveCreds } = await useMultiFileAuthState(credsPath);

  let conn = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.macOS("Desktop"),
    downloadHistory: false,
    syncFullHistory: false,
  });

  store.bind(conn.ev);

  setInterval(() => {
    store.writeToFile("./lib/store_db.json");
    console.log("saved store");
  }, 30 * 60 * 1000);

  conn.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;
    if (connection === "connecting") {
      console.log("nezuko");
      console.log("Connecting to megajs... ♻️");
    }

    if (
      connection === "close" &&
      lastDisconnect &&
      lastDisconnect.error &&
      lastDisconnect.error.output.statusCode != 401
    ) {
      console.log(lastDisconnect.error.output.payload);
      Abhiy();
    }

    if (connection === "open") {
      console.log("Connected to megajs ✅");
      console.log("Loading plugins ♻️");

      let plugins = await PluginDB.findAll();
      plugins.map(async (plugin) => {
        if (!fs.existsSync("./plugins/" + plugin.dataValues.name + ".js")) {
          console.log(plugin.dataValues.name);
          let response = await got(plugin.dataValues.url);
          if (response.statusCode === 200) {
            fs.writeFileSync(
              "./plugins/" + plugin.dataValues.name + ".js",
              response.body
            );
            require("./plugins/" + plugin.dataValues.name + ".js");
          }
        }
      });

      console.log("Plugins loaded ✅");

      fs.readdirSync("./plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === ".js") {
          require("./plugins/" + plugin);
        }
      });

      console.log("Connected to whatsapp ✅");

      let str = `𝚀𝚄𝙴𝙴𝙽 𝙽𝙴𝚉𝚄𝙺𝙾 𝚂𝚃𝙰𝚁𝚃𝙴𝙳 \n\n\n𝚅𝙴𝚁𝚂𝙸𝙾𝙽   : *${require("./package.json").version}* \n𝙿𝙻𝚄𝙶𝙸𝙽𝚂  : *${events.commands.length}* \n𝙼𝙾𝙳𝙴  : *${config.WORK_TYPE}* \n𝙷𝙰𝙽𝙳𝙻𝙴𝚁  : *${config.HANDLERS}*`;
      conn.sendMessage(conn.user.id, { text: str });

      try {
        conn.ev.on("creds.update", saveCreds);

        conn.ev.on("group-participants.update", async (data) => {
          Greetings(data, conn);
        });

        conn.ev.on("messages.upsert", async (m) => {
          if (m.type !== "notify") return;
          let ms = m.messages[0];
          let msg = await serialize(JSON.parse(JSON.stringify(ms)), conn);
          if (!msg.message) return;
          let text_msg = msg.body;

          if (text_msg && config.LOGS) {
            console.log(
              `At : ${
                msg.from.endsWith("@g.us")
                  ? (await conn.groupMetadata(msg.from)).subject
                  : msg.from
              }\nFrom : ${msg.sender}\nMessage:${text_msg}`
            );
          }

          events.commands.map(async (command) => {
            if (
              command.fromMe &&
              !config.SUDO.split(",").includes(msg.sender.split("@")[0]) &&
              !msg.isSelf
            )
              return;

            let comman;
            if (text_msg) {
              comman = text_msg.trim().split(/ +/)[0];
              msg.prefix = new RegExp(config.HANDLERS).test(text_msg)
                ? text_msg.split("").shift()
                : ",";
            }

            let whats;
            if (command.pattern && command.pattern.test(comman)) {
              let match;
              try {
                match = text_msg.replace(new RegExp(comman, "i"), "").trim();
              } catch {
                match = false;
              }
              whats = new Message(conn, msg, ms);
              command.function(whats, match, msg, conn);
            } else if (text_msg && command.on === "text") {
              whats = new Message(conn, msg, ms);
              command.function(whats, text_msg, msg, conn, m);
            } else if (
              (command.on === "image" || command.on === "photo") &&
              msg.type === "imageMessage"
            ) {
              whats = new Image(conn, msg, ms);
              command.function(whats, text_msg, msg, conn, m, ms);
            } else if (
              command.on === "sticker" &&
              msg.type === "stickerMessage"
            ) {
              whats = new Sticker(conn, msg, ms);
              command.function(whats, msg, conn, m, ms);
            }
          });
        });
      } catch (e) {
        console.log(e.stack + "\n\n\n\n\n" + JSON.stringify(msg));
      }
    }
  });

  process.on("uncaughtException", async (err) => {
    let error = err.message;
    console.log(err);
    await conn.sendMessage(conn.user.id, { text: error });
  });
}

setTimeout(() => {
  Abhiy();
}, 5000);
