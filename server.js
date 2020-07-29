const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


const kuromoji = require('kuromoji');

const DIC_DIR = 'dict';

// // Load dictionaries from file, and prepare tokenizer
// kuromoji.builder({ dicPath: DIC_DIR }).build().then((tokenizer) => {
//   // const path = tokenizer.tokenize('すもももももももものうち');
//   const path = tokenizer.tokenize('西井万理那');
//   console.log(path);
//   module.exports = tokenizer;
// });


let tokenizer = null;
kuromoji.builder({ dicPath: DIC_DIR }).build().then((t) => {
  console.log('Kuromoji.js has been loaded.');
  tokenizer = t;
});



// parse application/json
app.use(bodyParser.json());

app.get('/api/nlp', (req, res) => {
  console.log(req.body);

  if (!req.body) {
    return res.status(400).end();
  }

  if (!req.body.text) {
    return res.status(400).end();
  }

  if (!tokenizer) {
    return res.status(503).end();
  }

  const textPath = tokenizer.tokenize(req.body.text);
  res.json(textPath);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

