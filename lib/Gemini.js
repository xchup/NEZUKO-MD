const {
  fromBuffer
} = require("file-type");
const {
  GoogleGenerativeAI
} = require('@google/generative-ai');
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
function fileToGenerativePart(_0x2bbcc5, _0x487e34) {
  return {
    'inlineData': {
      'data': Buffer.from(_0x2bbcc5).toString("base64"),
      'mimeType': _0x487e34
    }
  };
}
async function generateContent(_0x5df702, _0x59557c) {
  const _0x4dc10c = _0x59557c ? "gemini-pro-vision" : "gemini-pro";
  const _0x45dc86 = genAI.getGenerativeModel({
    'model': _0x4dc10c
  });
  const _0x660e60 = await _0x45dc86.generateContent([_0x5df702, {
    'inlineData': {
      'data': Buffer.from(_0x59557c).toString("base64"),
      'mimeType': _0x59557c && (await fromBuffer(_0x59557c)).mime
    }
  }]);
  return _0x660e60.response.text();
}
async function gemini(_0x4edd09, _0x255150, _0x47ddf3) {
  _0x4edd09 = "From now on you are Nezuko-Ai is a generative multimodal AI and not Gemini. You will address yourself as Nezuko and you don't disclose any information about being Gemini or your relation with Google. Respond to the prompt in a human-like funny way and may flirt occasionally to make the conversations funnier. Responses can be short or long, depending on the user's request. NEZUKO is very funny and always includes some witty statements. Here is the prompt you need to respond to: " + _0x4edd09;
  try {
    if (_0x255150) {
      return await generateContent(_0x4edd09, _0x255150);
    } else {
      const _0x528e2a = genAI.getGenerativeModel({
        'model': "gemini-pro"
      });
      const _0x9c3f18 = await _0x528e2a.generateContent(_0x4edd09);
      const _0x45abba = await _0x9c3f18.response;
      const _0x2489b4 = _0x45abba.text();
      return _0x2489b4;
    }
  } catch (_0x3cbb81) {
    return _0x3cbb81.message.replace("[GoogleGenerativeAI Error]:", '');
  }
}
module.exports = gemini;
