const { command } = require('../lib');

command({
  pattern: 'restart',
  fromMe: true,
  desc: 'Restart the bot',
  type: 'system',
}, async (message) => {
  await message.reply('♻️ Restarting bot...');
  process.exit(1); 
});
