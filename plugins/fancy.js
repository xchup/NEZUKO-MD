const config = require("../config");
const { command, isPrivate, tiny, getBuffer, styletext, listall } = require("../lib/");

command(
  {
    pattern: "fancy",
    fromMe: isPrivate,
    desc: "converts text to fancy text",
    type: "converter",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.text || !match || isNaN(match)) {
      let text = tiny(
        "\n𝙵𝙰𝙽𝙲𝚈 𝚃𝙴𝚇𝚃 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙾𝚁\n\n𝚁𝙴𝙿𝙻𝙰𝚈 𝚃𝙾 𝙰 𝙼𝙴𝚂𝚂𝙰𝙶𝙴\nExample: 𝙵𝙰𝙽𝙲𝚈 𝟹𝟸\n\n"
      );
      listall("Fancy").forEach((txt, num) => {
        text += `${(num += 1)} ${txt}\n`;
      });
      text += "\n\n© 𝚀𝚄𝙴𝙴𝙽-𝙽𝙴𝚉𝚄𝙺𝙾";

      // Prepare your image
      const imageBuffer = await getBuffer("https://ik.imagekit.io/Oggy/yb5VN2_E3YJf6Vlc.jpg"); // Replace with your image URL
      
      // Send a text and image together
      return await message.client.sendMessage(message.jid, {
        text: text,  // Send the fancy text
        image: imageBuffer,  // Send the image
        caption: "𝐅𝐚𝐧𝐜𝐲 𝐓𝐞𝐱𝐭 𝐆𝐞𝐧𝐚𝐫𝐚𝐭𝐨𝐫",  // Optional caption for the image
      });
    } else {
      message.reply(styletext(message.reply_message.text, parseInt(match)));
    }
  }
);
