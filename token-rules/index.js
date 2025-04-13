const ruleCounter = require('./rule-counter');
const ruleDate = require('./rule-date');
const ruleMonth = require('./rule-month');
const rulePurify = require('./rule-purify');

const tokenRules = [
  ruleMonth,
  ruleDate,
  ruleCounter,
  rulePurify,
];

const rebulidTokens = (tokens) => tokens.map(
  (token) => tokenRules.reduce((ret, rule) => rule(ret), token),
);

module.exports = {
  rebulidTokens,
};
