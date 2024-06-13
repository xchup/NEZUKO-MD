const { command , isPrivate , getBuffer, getJson } = require("../lib");
const fetch = require("node-fetch");
const ytdl = require("ytdl-core");
const axios = require("axios");
const cheerio = require("cheerio");
const X = require("../config");
command({
  'pattern': "song",
  'fromMe': isPrivate,
  'desc': "Song Downloader",
  'type': 'downloader'
}, async (_0x118cc2, _0x3aead2) => {
  if (process.cwd() !== '/root/nezuko') {
    return _0x118cc2.reply("use og version");
  }
  if (!_0x3aead2) {
    return await _0x118cc2.sendMessage("*_Need Song Name Or Url_*");
  }
  var _0x4447b9 = await axios.get("https://api-viper-x.koyeb.app/api/song?name=" + _0x3aead2);
  var _0xe074a6 = _0x4447b9.data;
  await _0x118cc2.client.sendMessage(_0x118cc2.jid, {
    'text': "*_Downloading " + _0xe074a6.data.title + '_*'
  }, {
    'quoted': _0x118cc2
  });
  const _0x13f879 = await (await fetch('' + _0xe074a6.data.downloadUrl)).buffer();
  await _0x118cc2.client.sendMessage(_0x118cc2.jid, {
    'audio': _0x13f879,
    'mimetype': 'audio/mpeg'
  }, {
    'quoted': _0x118cc2
  });
});
command({
  'pattern': "video",
  'fromMe': isPrivate,
  'desc': "Yt Video Downloader",
  'type': "downloader"
}, async (_0x310a96, _0x469ae6) => {
  if (process.cwd() !== '/root/nezuko') {
    return _0x310a96.reply("use og version");
  }
  if (!_0x469ae6) {
    return await _0x310a96.sendMessage("*_Need a Video Name_*");
  }
  let {
    result: _0x3ec7bb
  } = await getJson("https://api-aswin-sparky.koyeb.app/api/downloader/yt_video?search=" + _0x469ae6);
  await _0x310a96.client.sendMessage(_0x310a96.jid, {
    'text': "*_Downloading " + _0x3ec7bb.title + '_*'
  }, {
    'quoted': _0x310a96
  });
  return await _0x310a96.sendFromUrl(_0x3ec7bb.url, {
    'caption': '*' + _0x3ec7bb.title + '*'
  }, {
    'quoted': _0x310a96
  });
});
command({
  'pattern': 'yta',
  'fromMe': isPrivate,
  'desc': "YouTube song Downloader",
  'type': "downloader"
}, async (_0x14e08a, _0x5b025b, _0x4b7905) => {
  if (process.cwd() !== "/root/nezuko") {
    return _0x14e08a.reply("use og version ");
  }
  if (!isUrl(_0x5b025b)) {
    return await _0x14e08a.reply("*_Need YouTube Url_*");
  }
  let _0x111c16 = await ytmp3(_0x5b025b);
  await _0x14e08a.client.sendMessage(_0x14e08a.jid, {
    'audio': _0x111c16.buffer,
    'mimetype': "audio/mpeg"
  }, {
    'quoted': _0x14e08a
  }, "audio");
});
async function ytmp3(_0x5509ea) {
  try {
    const {
      videoDetails: _0x3ebcd6
    } = await ytdl.getInfo(_0x5509ea, {
      'lang': 'id'
    });
    const _0x4919b7 = ytdl(_0x5509ea, {
      'filter': "audioonly",
      'quality': "highestaudio"
    });
    const _0x1fc401 = [];
    _0x4919b7.on('data', _0x20c26f => {
      _0x1fc401.push(_0x20c26f);
    });
    await new Promise((_0x3650fa, _0x30e585) => {
      _0x4919b7.on("end", _0x3650fa);
      _0x4919b7.on("error", _0x30e585);
    });
    const _0x3856d7 = Buffer.concat(_0x1fc401);
    return {
      'meta': {
        'title': _0x3ebcd6.title,
        'channel': _0x3ebcd6.author.name,
        'seconds': _0x3ebcd6.lengthSeconds,
        'description': _0x3ebcd6.description,
        'image': _0x3ebcd6.thumbnails.slice(-0x1)[0x0].url
      },
      'buffer': _0x3856d7,
      'size': _0x3856d7.length
    };
  } catch (_0x25e5e4) {
    throw _0x25e5e4;
  }
}
;
command({
  'pattern': "ytv",
  'fromMe': isPrivate,
  'desc': "YouTube Video Downloader",
  'type': "downloader"
}, async (_0x556704, _0xce2e8f) => {
  if (process.cwd() !== '/root/nezuko') {
    return _0x556704.reply("use og version ");
  }
  if (!isUrl(_0xce2e8f)) {
    return await _0x556704.reply("*_Need YouTube Url_*");
  }
  let _0x31cb17 = await ytmp4(_0xce2e8f, '134');
  await _0x556704.sendFromUrl(_0x31cb17.videoUrl, {
    'caption': X.CAPTION
  }, {
    'quoted': _0x556704
  });
});
function formatDuration(_0x317cb2) {
  const _0x573a83 = Math.floor(_0x317cb2 / 0xe10);
  const _0x2bbf0e = Math.floor(_0x317cb2 % 0xe10 / 0x3c);
  const _0x167fa0 = _0x317cb2 % 0x3c;
  const _0x39f062 = [];
  if (_0x573a83 > 0x0) {
    _0x39f062.push(_0x573a83 + " hour");
  }
  if (_0x2bbf0e > 0x0) {
    _0x39f062.push(_0x2bbf0e + " minute");
  }
  if (_0x167fa0 > 0x0) {
    _0x39f062.push(_0x167fa0 + " second");
  }
  return _0x39f062.join(" ");
}
function formatBytes(_0x50c61f) {
  if (_0x50c61f === 0x0) {
    return "0 B";
  }
  const _0x571973 = ['B', 'KB', 'MB', 'GB', 'TB'];
  const _0x13026d = Math.floor(Math.log(_0x50c61f) / Math.log(0x400));
  return (_0x50c61f / 0x400 ** _0x13026d).toFixed(0x2) + " " + _0x571973[_0x13026d];
}
async function ytmp4(_0x2b3c08, _0x4debcc = 0x86) {
  try {
    const _0x2340a7 = await ytdl.getInfo(_0x2b3c08, {
      'lang': 'id'
    });
    const _0x2dbbfc = ytdl.chooseFormat(_0x2340a7.formats, {
      'format': _0x4debcc,
      'filter': "videoandaudio"
    });
    let _0x264a88 = await fetch(_0x2dbbfc.url, {
      'method': "HEAD"
    });
    let _0x5f3548 = _0x264a88.headers.get('content-length');
    let _0x28d091 = parseInt(_0x5f3548);
    return {
      'title': _0x2340a7.videoDetails.title,
      'thumb': _0x2340a7.videoDetails.thumbnails.slice(-0x1)[0x0],
      'date': _0x2340a7.videoDetails.publishDate,
      'duration': formatDuration(_0x2340a7.videoDetails.lengthSeconds),
      'channel': _0x2340a7.videoDetails.ownerChannelName,
      'quality': _0x2dbbfc.qualityLabel,
      'contentLength': formatBytes(_0x28d091),
      'description': _0x2340a7.videoDetails.description,
      'videoUrl': _0x2dbbfc.url
    };
  } catch (_0x318a85) {
    throw _0x318a85;
  }
}
command({
  'pattern': "spotify",
  'fromMe': isPrivate,
  'desc': "Spotify Song Downloader",
  'type': "downloader"
}, async (_0x4a2122, _0x4e3640, _0x34c883) => {
  if (process.cwd() !== '/root/nezuko') {
    return _0x4a2122.reply("use og version ");
  }
  _0x4e3640 = _0x4e3640 || _0x4a2122.reply_message.text;
  if (!_0x4e3640) {
    return await _0x4a2122.reply("*_Need Spotify Url_*");
  }
  let _0x74101d = (await getJson("https://api.maher-zubair.tech/download/spotify?url=" + _0x4e3640)).result.url;
  await _0x4a2122.sendFromUrl(_0x74101d, {
    'quoted': _0x4a2122
  });
});
command({
  'pattern': "pinterest",
  'fromMe': isPrivate,
  'desc': "Pinterest Downloader",
  'type': "downloader"
}, async (_0x32ad55, _0x1ab140) => {
  if (process.cwd() !== "/root/nezuko") {
    return _0x32ad55.reply("use og version ");
  }
  if (!isUrl(_0x1ab140)) {
    return await _0x32ad55.sendMessage("*_Need Pinterest Url_*");
  }
  var {
    result: _0x1bbe07
  } = await getJson('https://api.lokiser.xyz/api/pinterestdl?link=' + _0x1ab140);
  await _0x32ad55.sendFromUrl(_0x1bbe07.LokiXer.url, {
    'caption': X.CAPTION
  }, {
    'quoted': _0x32ad55
  });
});
command({
  'pattern': 'gitdl',
  'fromMe': isPrivate,
  'desc': "Repository Downloader",
  'type': "downloader"
}, async (_0x557b31, _0x2dac4d, _0x357221) => {
  if (process.cwd() !== "/root/nezuko") {
    return _0x557b31.reply("use og version");
  }
  if (!isUrl(_0x2dac4d)) {
    return await _0x557b31.reply("*_Need A Repo Url_*");
  }
  let _0x3f5efd = _0x2dac4d.split('/')[0x3];
  let _0x28a71c = _0x2dac4d.split('/')[0x4];
  let _0x2bbcc9 = "https://api.github.com/repos/" + _0x3f5efd + '/' + _0x28a71c + "/zipball";
  await _0x557b31.reply("*_Downloading_*");
  await _0x557b31.client.sendMessage(_0x557b31.jid, {
    'document': {
      'url': _0x2bbcc9
    },
    'fileName': _0x28a71c,
    'mimetype': 'application/zip'
  }, {
    'quoted': _0x557b31
  });
});
command({
  'pattern': 'tbox',
  'fromMe': isPrivate,
  'desc': "terabox Downloader",
  'type': 'downloader'
}, async (_0x4cc380, _0x2ec3c3) => {
  if (process.cwd() !== "/root/nezuko") {
    return _0x4cc380.reply("use og version");
  }
  _0x2ec3c3 = _0x2ec3c3 || _0x4cc380.reply_message.text;
  if (!_0x2ec3c3) {
    return _0x4cc380.reply("*_Need Terabox Link_*\n*Nb:- Please provide link less than 100MB*");
  }
  let _0xd693d6 = await getJson('https://terabox-app.vercel.app/api?data=' + _0x2ec3c3);
  return await _0x4cc380.sendFromUrl(_0xd693d6.direct_link, {
    'caption': X.CAPTION
  });
});
command({
  'pattern': 'xvd',
  'fromMe': true,
  'desc': "xv Downloader",
  'type': "downloader"
}, async (_0x5904a3, _0x42fb3c) => {
  if (process.cwd() !== "/root/nezuko") {
    return _0x5904a3.reply("use og version ");
  }
  if (!_0x42fb3c) {
    return await _0x5904a3.sendMessage("*_Need a xv Link_*");
  }
  var _0x4647f7 = await fetch("https://raganork-network.vercel.app/api/xvideos/download?url=" + _0x42fb3c);
  var _0x3667f8 = await _0x4647f7.json();
  await _0x5904a3.client.sendMessage(_0x5904a3.jid, {
    'video': {
      'url': _0x3667f8.url
    },
    'caption': 𝐗.CAPTION
  }, {
    'quoted': _0x5904a3
  });
});
command({
  'pattern': "upload",
  'fromMe': isPrivate,
  'desc': "Downloads & uploads media from raw URL",
  'type': "downloader"
}, async (_0x378d49, _0x4baba9) => {
  if (process.cwd() !== "/root/nezuko") {
    return _0x378d49.reply("use og version");
  }
  _0x4baba9 = _0x4baba9 || m.quoted.text;
  if (!_0x4baba9) {
    return _0x378d49.reply("*_Need a imgur/graph Link_*");
  }
  return await _0x378d49.sendFromUrl(_0x4baba9, {
    'caption': X.CAPTION
  }, {
    'quoted': _0x378d49
  });
});
command({
  'pattern': "mediafire",
  'fromMe': isPrivate,
  'desc': "Mediafire Downloader",
  'type': "downloader"
}, async (_0x13d585, _0x2f2ad9) => {
  if (process.cwd() !== '/root/nezuko') {
    return _0x13d585.reply("use Original verison!");
  }
  if (!_0x2f2ad9) {
    return await _0x13d585.sendMessage("*_Need A Mediafire Url_*");
  }
  const _0x599e45 = async _0xfc753a => {
    const _0x4eb70e = await axios.get(_0xfc753a);
    const _0x22cd7d = cheerio.load(_0x4eb70e.data);
    const _0x551e91 = [];
    const _0x2c7cff = _0x22cd7d("a#downloadButton").attr("href");
    const _0x285d18 = _0x22cd7d("a#downloadButton").text().replace('Download', '').replace('(', '').replace(')', '').replace("\n", '').replace("\n", '').replace("                         ", '');
    const _0x1b52a7 = _0x2c7cff.split('/');
    const _0x33fbff = _0x1b52a7[0x5];
    mime = _0x33fbff.split('.');
    mime = mime[0x1];
    _0x551e91.push({
      'name': _0x33fbff,
      'mime': mime,
      'size': _0x285d18,
      'link': _0x2c7cff
    });
    return _0x551e91;
  };
  var _0x5aad13 = await _0x599e45('' + _0x2f2ad9);
  await _0x13d585.client.sendMessage(_0x13d585.jid, {
    'text': "*_Downloading " + _0x5aad13[0x0].name + "_*\n\n*size : " + _0x5aad13[0x0].size + "*\n\n𝐄𝐙𝐑𝐀-𝐗𝐃"
  }, {
    'quoted': _0x13d585
  });
  await _0x13d585.client.sendMessage(_0x13d585.jid, {
    'document': {
      'url': _0x5aad13[0x0].link
    },
    'fileName': _0x5aad13[0x0].name,
    'mimetype': _0x5aad13[0x0].mime
  }, {
    'quoted': _0x13d585
  });
});
command({
  'pattern': "dalle",
  'fromMe': isPrivate,
  'desc': "ai image generator",
  'type': 'downloader'
}, async (_0x5494a1, _0x1d4a73, _0x34ad48) => {
  if (process.cwd() !== '/root/nezuko') {
    return _0x5494a1.reply("use og version ");
  }
  _0x1d4a73 = _0x1d4a73 || _0x5494a1.reply_message.text;
  if (!_0x1d4a73) {
    return await _0x5494a1.reply("*_Need A Text_*\n*eg:- .dalle a modified porshe in beach*");
  }
  await _0x5494a1.sendFromUrl("https://cute-tan-gorilla-yoke.cyclic.app/imagine?text=" + _0x1d4a73, {
    'caption': '*𝐐𝐮𝐞𝐞𝐧 𝐍𝐞𝐳𝐮𝐤𝐨⭐*'
  });
});
