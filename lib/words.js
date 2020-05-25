const Mint = require('mint-filter').default;

let words = [];
let mint;

function updateWords(text) {
  words = text.split('\n')
    .map(word => word.trim())
    .filter(word => word);
  mint = new Mint(words);
}

function getWords() {
  return words;
}

async function check(postTxt) {
  const result = await mint.filter(postTxt, { replace: false });
  return result;
}

module.exports = {
  getWords, updateWords, check,
};
