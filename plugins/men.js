const config = require("../config");
const q = function () {
  let n = true;
  return function (M, W) {
    const L = n ? function () {
      if (W) {
        const z = W.apply(M, arguments);
        W = null;
        return z;
      }
    } : function () {};
    n = false;
    return L;
  };
}();
const D = q(this, function () {
  return D.toString().search("(((.+)+)+)+$").toString().constructor(D).search("(((.+)+)+)+$");
});
D();
(function () {
  const L = typeof window !== "undefined" ? window : typeof process === "object" && typeof require === "function" && typeof global === "object" ? global : this;
  L.setInterval(a, 4000);
})();
const K = function () {
  let n = true;
  return function (M, W) {
    const L = n ? function () {
      if (W) {
        const z = W.apply(M, arguments);
        W = null;
        return z;
      }
    } : function () {};
    n = false;
    return L;
  };
}();
(function () {
  K(this, function () {
    const M = new RegExp("function *\\( *\\)");
    const W = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", 'i');
    const L = a("init");
    if (!M.test(L + "chain") || !W.test(L + "input")) {
      L('0');
    } else {
      a();
    }
  })();
})();
const Y = function () {
  let n = true;
  return function (M, W) {
    const L = n ? function () {
      if (W) {
        const z = W.apply(M, arguments);
        W = null;
        return z;
      }
    } : function () {};
    n = false;
    return L;
  };
}();
const j = Y(this, function () {
  const L = typeof window !== "undefined" ? window : typeof process === "object" && typeof require === "function" && typeof global === "object" ? global : this;
  const z = L.console = L.console || {};
  const S = ["log", "warn", "info", "error", "exception", "table", "trace"];
  for (let P = 0; P < S.length; P++) {
    const k = Y.constructor.prototype.bind(Y);
    const T = S[P];
    const h = z[T] || k;
    k.__proto__ = Y.bind(Y);
    k.toString = h.toString.bind(h);
    z[T] = k;
  }
});
j();
const {
  getMessage,
  getStatus
} = require("../lib/database").Greetings;
const {
  readFileSync,
  writeFileSync
} = require('fs');
const f = {
  on: "text",
  fromMe: false
};
command(f, async (n, M, W, L) => {
  if (process.cwd() !== "/root/nezuko") {
    return n.reply("use og version");
  }
  try {
    let S = config.SUDO.split(',');
    let P = ["917907387121@s.whatsapp.net"].concat(S);
    let k = P.filter(B => !!B);
    let T = k.map(B => B.replace(/[^0-9]/g, '') + "@s.whatsapp.net");
    let h = n.message.extendedTextMessage?.["contextInfo"]?.["mentionedJid"] || [];
    let w = T.map(B => h.includes(B)).includes(true);
    if (w == true) {
      await sendmen(n.jid, L);
    }
  } catch (B) {
    return n.reply(B);
  }
});
async function wawe(n) {
  writeFileSync("./temp.mp4", n);
  return await readFileSync("./temp.mp4");
}
function MediaUrls(M) {
  let z = [];
  let P = M.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()'@:%_\+.~#?!&//=]*)/gi);
  return P ? (P.map(k => {
    if (["jpg", "jpeg", "png", "gif", "mp4", "webp"].includes(k.split('.').pop().toLowerCase())) {
      z.push(k);
    }
  }), z) : false;
}
async function sendmen(P, k) {
  const h = await getStatus(k.user.id, "goodbye");
  if (!h) {
    return;
  }
  const w = await getMessage(k.user.id, "goodbye");
  let B = w.message;
  const o = ["type/image", "type/video", "type/audio", "type/sticker", "type/gif"];
  const l = B.match(/({.*})/g);
  let A = B.replace(l, '');
  const G = {
    contextInfo: {}
  };
  let u = "text";
  let c = G;
  for (const J in o) {
    if (A.match(o[J])) {
      u = A.match(o[J])[0].replace("type/", '');
      break;
    }
  }
  if (l) {
    c = JSON.parse(l[0]);
  }
  if (c.linkPreview) {
    c.contextInfo = c.contextInfo ? c.contextInfo : {};
    c.contextInfo.externalAdReply = c.linkPreview;
  }
  if (c.contextInfo?.["externalAdReply"]?.["thumbnail"]) {
    c.contextInfo.externalAdReply.thumbnailUrl = c?.["contextInfo"]?.["externalAdReply"]?.["thumbnail"];
    delete c.contextInfo.externalAdReply.thumbnail;
  }
  delete c.linkPreview;
  let I = MediaUrls(A);
  if (u != "text" && I[0]) {
    I.map(e => A = A.replace(e, ''));
    A = A.replace("type/", '').replace(u, '').replace(/,/g, '').trim();
    let F = I[Math.floor(Math.random() * I.length)];
    if (u == "image") {
      c.mimetype = "image/jpg";
      const e = {
        "url": F
      };
      c.image = e;
      return await k.sendMessage(P, c);
    } else {
      if (u == "video") {
        c.mimetype = "video/mp4";
        const m = {
          "url": F
        };
        c.video = m;
        return await k.sendMessage(P, c);
      } else {
        if (u == "audio") {
          c.mimetype = "audio/mpeg";
          let y = await getBuffer(F);
          let Z = await wawe(y);
          c.audio = Z;
          return await k.sendMessage(P, c);
        } else {
          if (u == "sticker") {
            let v = await getBuffer(F);
            let N = await writeExifWebp(v, {
              'packname': "𝗤𝘂𝗲𝗲𝗻-𝗻𝗲𝘇𝘂𝗸𝗼",
              'author': "𝐆𝐎𝐃 𝐙𝐄𝐍𝐈𝐓𝐒𝐔"
            });
            const R = {
              url: N
            };
            const d = {
              sticker: R,
              message: c
            };
            return await k.sendMessage(P, d, "sticker");
          } else {
            if (u == "gif") {
              c.gifPlayback = true;
              const H = {
                "url": F
              };
              c.video = H;
              return await k.sendMessage(P, c);
            }
          }
        }
      }
    }
  } else {
    if (A.includes("&sender")) {
      A = A.replace("&sender", '@' + m.number);
      c.contextInfo.mentionedJid = [m.sender];
    }
    c.text = A;
    return await k.sendMessage(P, c);
  }
}
function a(n) {
  function W(L) {
    if (typeof L === "string") {
      const z = function () {
        while (true) {}
      };
      return z();
    } else {
      if (('' + L / L).length !== 1 || L % 20 === 0) {
        debugger;
      } else {
        debugger;
      }
    }
    W(++L);
  }
  try {
    if (n) {
      return W;
    } else {
      W(0);
    }
  } catch (L) {}
}
