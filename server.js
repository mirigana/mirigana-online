const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const kuromoji = require('kuromoji');

const { rebulidTokens } = require('./token-rules');

const DIC_DIR = 'dict';
const PORT = 43123;
const MIRIGANA_IDS = [
  // webstore
  'chrome-extension://hbekfodhcnfpkmoeaijgbamedofonjib',
  'moz-extension://0bd9240f-3bfc-7f49-9cda-bc24c463fe2c',

  // development
  'chrome-extension://pcggpapfbjmiohgbhhggedambekkgjio',
  'chrome-extension://mkiijbdigpappglhnlmdhppgdlaidbjf',
  'moz-extension://aedccddc-a2ea-6041-b195-a2669d918582',
];

const app = express();

app.use(cors((req, callback) => {
  const result = {
    origin: false,
    maxAge: 60 * 60 * 24,
  };

  const origin = req.header('Origin');
  if (!origin) {
    // empty origin
  } else if (origin.startsWith('moz-extension://')) {
    // workaround
    // ff has a dynamic origin which is not related to the extension id
    result.origin = true;
  } else if (MIRIGANA_IDS.includes(origin)) {
    result.origin = true;
  }

  callback(null, result);
}));


let tokenizer = null;
kuromoji.builder({ dicPath: DIC_DIR }).build().then((t) => {
  console.log('Kuromoji.js has been loaded.');
  tokenizer = t;
});

// parse application/json
app.use(bodyParser.json());

app.post('/nlp', (req, res) => {
  if (!tokenizer) {
    return res.status(503).json({ err: 'kuromoji service is not ready.' });
  }

  console.log(req.body);
  if (!req.body) {
    return res.status(400).json({ err: 'invalid request.' });
  }

  if (!Array.isArray(req.body)) {
    return res.status(400).json({ err: 'invalid request content.' });
  }

  const tokens = req.body.map((t) => tokenizer.tokenize(t));
  return res.json(rebulidTokens(tokens));
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
