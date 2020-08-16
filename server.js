const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const DIC_DIR = 'dict';
const PORT = 43123;
const MIRIGANA_IDS = [
  // webstore
  'hbekfodhcnfpkmoeaijgbamedofonjib',
  // development
  'pcggpapfbjmiohgbhhggedambekkgjio',
];

const app = express();

app.use(cors((req, callback) => {
  const result = { origin: false };

  const origin = req.header('Origin');
  if (!origin) {
    // empty origin
  } else if (MIRIGANA_IDS.includes(req.header('Origin').replace('chrome-extension://', ''))) {
    result.origin = true;
  }
  callback(null, result);
}));

const kuromoji = require('kuromoji');

let tokenizer = null;
kuromoji.builder({ dicPath: DIC_DIR }).build().then((t) => {
  console.log('Kuromoji.js has been loaded.');
  tokenizer = t;
});

const kanaToHira = (str = '') => str.replace(/[\u30a1-\u30f6]/g, (match) => {
  const chr = match.charCodeAt(0) - 0x60;
  return String.fromCharCode(chr);
});

const rulePurify = (token) => {
  const pured = token
    .filter((t) => /[\u4E00-\u9FFF]/.test(t.surface_form))
    .filter((t) => t.reading)
    .map((t) => ({
      s: t.surface_form,
      r: kanaToHira(t.reading),
      p: t.word_position - 1,
    }));
  return pured;
};

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

  const tokens = req.body.map((t) => {
    const token = tokenizer.tokenize(t);
    const purified = rulePurify(token);
    return purified;
  });

  return res.json(tokens);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
