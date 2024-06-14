const {
    jidDecode,
    downloadContentFromMessage,
    getContentType,
    generateForwardMessageContent,
    generateLinkPreviewIfRequired,
    generateWAMessageFromContent,
    makeInMemoryStore
  } = require("@whiskeysockets/baileys"),
    } = require('fs');
cmd = {
  0x1: ["-fs 1M", "-vcodec", "libwebp", '-vf', "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"],
  0x2: ["-fs 1M", '-vcodec', "libwebp"]
};
const pino = require('pino');
logger = pino({
  'level': "silent"
});
const store = makeInMemoryStore({
  'logger': pino().child({
    'level': 'silent',
    'stream': "store"
  })
});
const fetch = require("node-fetch");
const {
  fromBuffer
} = require("file-type");
let path = require("path");
const {
  writeExifImg,
  writeExifVid,
  imageToWebp,
  videoToWebp
} = require("./sticker");
const downloadMedia = (_0x8191ef, _0x3fa902) => new Promise(async (_0x538269, _0x3f0f87) => {
  let _0xbb9ea7 = Object.keys(_0x8191ef)[0x0];
  let _0x1aa6f1 = {
    'imageMessage': "image",
    'videoMessage': "video",
    'stickerMessage': 'sticker',
    'documentMessage': "document",
    'audioMessage': "audio"
  };
  let _0x40caba = _0x8191ef;
  if (_0xbb9ea7 == "templateMessage") {
    _0x40caba = _0x8191ef.templateMessage.hydratedFourRowTemplate;
    _0xbb9ea7 = Object.keys(_0x40caba)[0x0];
  }
  if (_0xbb9ea7 == "buttonsMessage") {
    _0x40caba = _0x8191ef.buttonsMessage;
    _0xbb9ea7 = Object.keys(_0x40caba)[0x0];
  }
  try {
    if (_0x3fa902) {
      const _0x3f4fac = await downloadContentFromMessage(_0x40caba[_0xbb9ea7], _0x1aa6f1[_0xbb9ea7]);
      let _0x437d83 = Buffer.from([]);
      for await (const _0x74d3bb of _0x3f4fac) {
        _0x437d83 = Buffer.concat([_0x437d83, _0x74d3bb]);
      }
      await fs.promises.writeFile(_0x3fa902, _0x437d83);
      _0x538269(_0x3fa902);
    } else {
      const _0x386d2d = await downloadContentFromMessage(_0x40caba[_0xbb9ea7], _0x1aa6f1[_0xbb9ea7]);
      let _0x2572cb = Buffer.from([]);
      for await (const _0x50c641 of _0x386d2d) {
        _0x2572cb = Buffer.concat([_0x2572cb, _0x50c641]);
      }
      _0x538269(_0x2572cb);
    }
  } catch (_0x315fc0) {
    _0x3f0f87(_0x315fc0);
  }
});
async function serialize(_0x38ecf6, _0x479406) {
  _0x38ecf6.decodeJid = _0xdb667 => {
    if (/:\d+@/gi.test(_0xdb667)) {
      const _0x1a3ca7 = jidDecode(_0xdb667) || {};
      return (_0x1a3ca7.user && _0x1a3ca7.server && _0x1a3ca7.user + '@' + _0x1a3ca7.server || _0xdb667).trim();
    } else {
      return _0xdb667;
    }
  };
  _0x479406.copyNForward = async (_0x132054, _0x334772, _0x1c88cd = false, _0x2bea6e = {}) => {
    let _0x2036e6;
    if (_0x2bea6e.readViewOnce) {
      _0x334772.message = _0x334772.message && _0x334772.message.ephemeralMessage && _0x334772.message.ephemeralMessage.message ? _0x334772.message.ephemeralMessage.message : _0x334772.message || undefined;
      _0x2036e6 = Object.keys(_0x334772.message.viewOnceMessage.message)[0x0];
      delete (_0x334772.message && _0x334772.message.ignore ? _0x334772.message.ignore : _0x334772.message || undefined);
      delete _0x334772.message.viewOnceMessage.message[_0x2036e6].viewOnce;
      _0x334772.message = {
        ..._0x334772.message.viewOnceMessage.message
      };
    }
    let _0x443342 = Object.keys(_0x334772.message)[0x0];
    let _0x5d4852 = await generateForwardMessageContent(_0x334772, _0x1c88cd);
    let _0x3cdcc4 = Object.keys(_0x5d4852)[0x0];
    let _0x4d2cbf = {};
    if (_0x443342 != "conversation") {
      _0x4d2cbf = _0x334772.message[_0x443342].contextInfo;
    }
    _0x5d4852[_0x3cdcc4].contextInfo = {
      ..._0x4d2cbf,
      ..._0x5d4852[_0x3cdcc4].contextInfo
    };
    const _0x19afa7 = await generateWAMessageFromContent(_0x132054, _0x5d4852, _0x2bea6e ? {
      ..._0x5d4852[_0x3cdcc4],
      ..._0x2bea6e,
      ...(_0x2bea6e.contextInfo ? {
        'contextInfo': {
          ..._0x5d4852[_0x3cdcc4].contextInfo,
          ..._0x2bea6e.contextInfo
        }
      } : {})
    } : {});
    await _0x479406.relayMessage(_0x132054, _0x19afa7.message, {
      'messageId': _0x19afa7.key.id
    });
    return _0x19afa7;
  };
  _0x38ecf6.sendContact = async (_0x459a11, _0x45343b, _0x4bd7e0, _0x9aaa4d = false, _0x33f1b0 = {}) => {
    let _0x196149 = [];
    for (let _0x285203 of _0x45343b) {
      num = typeof _0x285203 == "number" ? _0x285203 + '@s.whatsapp.net' : _0x285203;
      num2 = typeof _0x285203 == "number" ? _0x285203 : _0x285203.split('@')[0x0];
      _0x196149.push({
        'displayName': _0x4bd7e0,
        'vcard': "BEGIN:VCARD\nVERSION:3.0\nFN:" + _0x4bd7e0 + "\nFN:" + _0x4bd7e0 + "\nitem1.TEL;waid=" + num2 + ':' + num2 + "\nitem1.X-ABLabel:Phone number\nitem4.ADR:;;India;;;;\nitem4.X-ABLabel:Region\nEND:VCARD"
      });
    }
    return _0x479406.sendMessage(_0x459a11, {
      'contacts': {
        'displayName': _0x196149.length + " Contact",
        'contacts': _0x196149
      },
      ..._0x33f1b0
    }, {
      'quoted': _0x9aaa4d
    });
  };
  _0x479406.logger = {
    ..._0x479406.logger,
    'info'() {
      console.log();
    },
    'error'() {
      console.log();
    },
    'warn'() {
      console.log();
    }
  };
  if (_0x38ecf6.key) {
    _0x38ecf6.id = _0x38ecf6.key.id;
    _0x38ecf6.isSelf = _0x38ecf6.key.fromMe;
    _0x38ecf6.from = _0x38ecf6.key.remoteJid;
    _0x38ecf6.isGroup = _0x38ecf6.from.endsWith("@g.us");
    _0x38ecf6.sender = _0x38ecf6.isGroup ? _0x38ecf6.decodeJid(_0x38ecf6.key.participant) : _0x38ecf6.isSelf ? _0x38ecf6.decodeJid(_0x479406.user.id) : _0x38ecf6.from;
  }
  if (_0x38ecf6.message) {
    _0x38ecf6.type = getContentType(_0x38ecf6.message);
    if (_0x38ecf6.type === "ephemeralMessage") {
      _0x38ecf6.message = _0x38ecf6.message[_0x38ecf6.type].message;
      const _0x1c513c = Object.keys(_0x38ecf6.message)[0x0];
      _0x38ecf6.type = _0x1c513c;
      if (_0x1c513c === "viewOnceMessage") {
        _0x38ecf6.message = _0x38ecf6.message[_0x38ecf6.type].message;
        _0x38ecf6.type = getContentType(_0x38ecf6.message);
      }
    }
    if (_0x38ecf6.type === "viewOnceMessage") {
      _0x38ecf6.message = _0x38ecf6.message[_0x38ecf6.type].message;
      _0x38ecf6.type = getContentType(_0x38ecf6.message);
    }
    try {
      _0x38ecf6.mentions = _0x38ecf6.message[_0x38ecf6.type].contextInfo ? _0x38ecf6.message[_0x38ecf6.type].contextInfo.mentionedJid || [] : [];
    } catch {
      _0x38ecf6.mentions = false;
    }
    try {
      const _0x4ea454 = _0x38ecf6.message[_0x38ecf6.type].contextInfo;
      if (_0x4ea454.quotedMessage.ephemeralMessage) {
        const _0x14427d = Object.keys(_0x4ea454.quotedMessage.ephemeralMessage.message)[0x0];
        if (_0x14427d === "viewOnceMessage") {
          _0x38ecf6.quoted = {
            'type': "view_once",
            'stanzaId': _0x4ea454.stanzaId,
            'sender': _0x38ecf6.decodeJid(_0x4ea454.participant),
            'message': _0x4ea454.quotedMessage.ephemeralMessage.message.viewOnceMessage.message
          };
        } else {
          _0x38ecf6.quoted = {
            'type': "ephemeral",
            'stanzaId': _0x4ea454.stanzaId,
            'sender': _0x38ecf6.decodeJid(_0x4ea454.participant),
            'message': _0x4ea454.quotedMessage.ephemeralMessage.message
          };
        }
      } else if (_0x4ea454.quotedMessage.viewOnceMessage) {
        _0x38ecf6.quoted = {
          'type': "view_once",
          'stanzaId': _0x4ea454.stanzaId,
          'sender': _0x38ecf6.decodeJid(_0x4ea454.participant),
          'message': _0x4ea454.quotedMessage.viewOnceMessage.message
        };
      } else {
        _0x38ecf6.quoted = {
          'type': 'normal',
          'stanzaId': _0x4ea454.stanzaId,
          'sender': _0x38ecf6.decodeJid(_0x4ea454.participant),
          'message': _0x4ea454.quotedMessage
        };
      }
      _0x38ecf6.quoted.isSelf = _0x38ecf6.quoted.sender === _0x38ecf6.decodeJid(_0x479406.user.id);
      _0x38ecf6.quoted.mtype = Object.keys(_0x38ecf6.quoted.message).filter(_0x22896b => _0x22896b.includes("Message") || _0x22896b.includes("conversation"))[0x0];
      _0x38ecf6.quoted.text = _0x38ecf6.quoted.message[_0x38ecf6.quoted.mtype].text || _0x38ecf6.quoted.message[_0x38ecf6.quoted.mtype].description || _0x38ecf6.quoted.message[_0x38ecf6.quoted.mtype].caption || _0x38ecf6.quoted.mtype == "templateButtonReplyMessage" && _0x38ecf6.quoted.message[_0x38ecf6.quoted.mtype].hydratedTemplate.hydratedContentText || _0x38ecf6.quoted.message[_0x38ecf6.quoted.mtype] || '';
      _0x38ecf6.quoted.key = {
        'id': _0x38ecf6.quoted.stanzaId,
        'fromMe': _0x38ecf6.quoted.isSelf,
        'remoteJid': _0x38ecf6.from
      };
      _0x38ecf6.quoted["delete"] = () => _0x479406.sendMessage(_0x38ecf6.from, {
        'delete': _0x38ecf6.quoted.key
      });
      _0x38ecf6.quoted.download = _0x36b4c2 => downloadMedia(_0x38ecf6.quoted.message, _0x36b4c2);
    } catch (_0xf0be4c) {
      _0x38ecf6.quoted = null;
    }
    try {
      _0x38ecf6.body = _0x38ecf6.message.conversation || _0x38ecf6.message[_0x38ecf6.type].text || _0x38ecf6.message[_0x38ecf6.type].caption || _0x38ecf6.type === 'listResponseMessage' && _0x38ecf6.message[_0x38ecf6.type].singleSelectReply.selectedRowId || _0x38ecf6.type === "buttonsResponseMessage" && _0x38ecf6.message[_0x38ecf6.type].selectedButtonId && _0x38ecf6.message[_0x38ecf6.type].selectedButtonId || _0x38ecf6.type === "templateButtonReplyMessage" && _0x38ecf6.message[_0x38ecf6.type].selectedId || false;
    } catch {
      _0x38ecf6.body = false;
    }
    _0x38ecf6.getQuotedObj = _0x38ecf6.getQuotedMessage = async () => {
      if (!_0x38ecf6.quoted.stanzaId) {
        return false;
      }
      let _0x64345 = await store.loadMessage(_0x38ecf6.from, _0x38ecf6.quoted.stanzaId, _0x479406);
      return serialize(_0x64345, _0x479406);
    };
    _0x479406.getFile = async (_0x3a8d4d, _0x4be03d) => {
      let _0x50f237;
      let _0x5bee2d;
      let _0x195f0a = Buffer.isBuffer(_0x3a8d4d) ? _0x3a8d4d : /^data:.*?\/.*?;base64,/i.test(_0x3a8d4d) ? Buffer.from(_0x3a8d4d.split`,`[0x1], "base64") : /^https?:\/\//.test(_0x3a8d4d) ? await (_0x50f237 = await fetch(_0x3a8d4d)).buffer() : fs.existsSync(_0x3a8d4d) ? (_0x5bee2d = _0x3a8d4d, fs.readFileSync(_0x3a8d4d)) : typeof _0x3a8d4d === 'string' ? _0x3a8d4d : Buffer.alloc(0x0);
      if (!Buffer.isBuffer(_0x195f0a)) {
        throw new TypeError("Result is not a buffer");
      }
      let _0xa4a048 = (await fromBuffer(_0x195f0a)) || {
        'mime': "application/octet-stream",
        'ext': ".bin"
      };
      if (_0x195f0a && _0x4be03d && !_0x5bee2d) {
        _0x5bee2d = path.join(__dirname, '../' + new Date() * 0x1 + '.' + _0xa4a048.ext);
        await fs.promises.writeFile(_0x5bee2d, _0x195f0a);
      }
      return {
        'res': _0x50f237,
        'filename': _0x5bee2d,
        ..._0xa4a048,
        'data': _0x195f0a
      };
    };
    _0x479406.sendImageAsSticker = async (_0x3f4cd2, _0x1373f8, _0x5d5ab7 = {}) => {
      let _0x51a22c;
      if (_0x5d5ab7 && (_0x5d5ab7.packname || _0x5d5ab7.author)) {
        _0x51a22c = await writeExifImg(_0x1373f8, _0x5d5ab7);
      } else {
        _0x51a22c = await imageToWebp(_0x1373f8);
      }
      await _0x479406.sendMessage(_0x3f4cd2, {
        'sticker': {
          'url': _0x51a22c
        },
        ..._0x5d5ab7
      }, _0x5d5ab7);
    };
    _0x479406.sendVideoAsSticker = async (_0x2c2f15, _0x51ce6a, _0x61df1e = {}) => {
      let _0xebed50;
      if (_0x61df1e && (_0x61df1e.packname || _0x61df1e.author)) {
        _0xebed50 = await writeExifVid(_0x51ce6a, _0x61df1e);
      } else {
        _0xebed50 = await videoToWebp(_0x51ce6a);
      }
      await _0x479406.sendMessage(_0x2c2f15, {
        'sticker': {
          'url': _0xebed50
        },
        ..._0x61df1e
      }, _0x61df1e);
    };
    _0x479406.reply = async (_0x1367bb, _0x4add90 = '') => {
      _0x479406.sendMessage(_0x38ecf6.from, {
        'text': require("util").format(_0x1367bb),
        'mentions': _0x4add90.withTag ? [..._0x1367bb.matchAll(/@([0-9]{5,16}|0)/g)].map(_0xd76772 => _0xd76772[0x1] + "@s.whatsapp.net") : [],
        ..._0x4add90
      }, {
        ..._0x4add90,
        'quoted': _0x38ecf6
      });
    };
    _0x38ecf6.sendFromUrl = async (_0x2fdb7b, _0x5840ff = '', _0x54363f = '', _0x444d76, _0x1d1bcd = false, _0x43c52c = {}) => {
      let _0x52b70a = await _0x479406.getFile(_0x2fdb7b, true);
      let {
        res: _0x22dfc0,
        data: _0x5781a5,
        filename: _0x402fad
      } = _0x52b70a;
      if (_0x22dfc0 && _0x22dfc0.status !== 0xc8 || _0x5781a5.length <= 0x10000) {
        try {
          throw {
            'json': JSON.parse(_0x5781a5.toString())
          };
        } catch (_0x4c04f5) {
          if (_0x4c04f5.json) {
            throw _0x4c04f5.json;
          }
        }
      }
      let _0x334e20 = {
        'filename': _0x5840ff
      };
      if (_0x444d76) {
        _0x334e20.quoted = _0x444d76;
      }
      if (!_0x52b70a) {
        if (_0x43c52c.asDocument) {
          _0x43c52c.asDocument = true;
        }
      }
      let _0x2ce2ca = '';
      let _0x4b0511 = _0x52b70a.mime;
      if (/webp/.test(_0x52b70a.mime)) {
        _0x2ce2ca = "sticker";
      } else {
        if (/image/.test(_0x52b70a.mime)) {
          _0x2ce2ca = "image";
        } else {
          if (/video/.test(_0x52b70a.mime)) {
            _0x2ce2ca = "video";
          } else {
            if (/audio/.test(_0x52b70a.mime)) {
              ss = await (_0x1d1bcd ? toPTT : toAudio2)(_0x5781a5, _0x52b70a.ext);
              skk = await require("file-type").fromBuffer(ss.data);
              ty = "./tmp/" + Date.now() + '.' + skk.ext;
              require('fs').writeFileSync(ty, ss.data);
              _0x402fad = ty;
              _0x2ce2ca = "audio";
              _0x4b0511 = "audio/mpeg";
            } else {
              _0x2ce2ca = "document";
            }
          }
        }
      }
      _0x479406.sendMessage(_0x38ecf6.from, {
        ..._0x43c52c,
        'caption': _0x54363f,
        'ptt': _0x1d1bcd,
        'fileName': _0x5840ff,
        [_0x2ce2ca]: {
          'url': _0x402fad
        },
        'mimetype': _0x4b0511
      }, {
        ..._0x334e20,
        ..._0x43c52c
      }).then(() => {
        fs.unlinkSync(_0x402fad);
      });
    };
    _0x479406.sendFile = async (_0x288ff0, _0x98dcba, _0x131b2e = {}) => {
      let _0x2118e6 = _0x40a1ec.split('/')[0x0];
      console.log(_0x40a1ec);
      let _0x200d28 = {
        ..._0x131b2e,
        [_0x2118e6]: {
          'url': _0x470015
        },
        'mimetype': _0x131b2e.mimetype || _0x40a1ec
      };
      let _0x350ce3;
      try {
        _0x350ce3 = await _0x479406.sendMessage(_0x288ff0, _0x200d28, {
          ..._0x131b2e
        });
      } catch (_0x35d605) {
        console.error(_0x35d605);
        _0x350ce3 = null;
      } finally {
        if (!_0x350ce3) {
          _0x350ce3 = await _0x479406.sendMessage(_0x288ff0, {
            ..._0x200d28,
            [_0x2118e6]: _0x48e9c4
          }, {
            ..._0x131b2e
          });
        }
        _0x48e9c4 = null;
        return _0x350ce3;
      }
    };
    _0x479406.store = async () => {
      return store;
    };
    _0x479406.reply = async (_0x45f45b, _0x34e463 = '') => {
      _0x479406.sendMessage(_0x38ecf6.from, {
        'text': require("util").format(_0x45f45b),
        'mentions': _0x34e463.withTag ? [..._0x45f45b.matchAll(/@([0-9]{5,16}|0)/g)].map(_0x4b3684 => _0x4b3684[0x1] + "@s.whatsapp.net") : [],
        ..._0x34e463
      }, {
        ..._0x34e463,
        'quoted': _0x38ecf6
      });
    };
    _0x38ecf6.adReply = async (_0x35b218, _0x4e78bf = "𝚉𝚎𝚝𝚊-𝚇𝙳", _0x42b47d = '', _0x3a5eb9 = '', _0x3bf589 = "true", _0x163c66 = 'true', _0x4adee3 = "https://i.imgur.com/TF4A0k6.jpeg") => {
      var _0x50497c = [{
        'key': {
          'remoteJid': "status@broadcast",
          'fromMe': false,
          'participant': "0@s.whatsapp.net"
        },
        'message': {
          'contactMessage': {
            'displayName': "𝐐𝐮𝐞𝐞𝐧 𝐍𝐞𝐳𝐮𝐤𝐨",
            'vcard': "BEGIN:VCARD\nVERSION:3.0\nN:ezraaaa\nFN:ezraaaa\nitem1.TEL;waid=917907387121:917907387121\nitem1.X-ABLabel:Click To Chat\nitem2.EMAIL;type=INTERNET:GitHub: godzenitsu\nitem2.X-ABLabel:Follow Me On Github\nitem3.URL:YouTube: illa\nitem3.X-ABLabel:Youtube\nitem4.ADR:;;India, Kerala;;;;\nitem4.X-ABLabel:Region\nEND:VCARD"
          }
        }
      }];
      let _0x4254b7 = _0x50497c[Math.floor(Math.random() * _0x50497c.length)];
      await _0x479406.sendMessage(_0x38ecf6.from, {
        'text': _0x35b218,
        'contextInfo': {
          'externalAdReply': {
            'title': _0x4e78bf,
            'body': _0x42b47d,
            'sourceUrl': _0x3a5eb9,
            'mediaUrl': _0x3a5eb9,
            'mediaType': 0x1,
            'showAdAttribution': _0x3bf589,
            'renderLargerThumbnail': _0x163c66,
            'thumbnailUrl': _0x4adee3
          }
        }
      }, {
        'quoted': _0x4254b7
      });
    };
    _0x38ecf6.send = async (_0x3f862c, _0x508ac2) => {
      _0x479406.sendMessage(_0x38ecf6.from, {
        'text': require('util').format(_0x3f862c),
        ..._0x508ac2
      }, {
        ..._0x508ac2
      });
    };
    _0x38ecf6.download = _0x126e2b => downloadMedia(_0x38ecf6.message, _0x126e2b);
    _0x479406.client = _0x38ecf6;
  }
  return _0x38ecf6;
}
module.exports = {
  'serialize': serialize,
  'downloadMedia': downloadMedia
};
