const DataLoader = require('dataloader');

const Actor = require('./actor');
const Director = require('./director');

function initLoader(obj) {
  const res = {};
  Object.keys(obj).forEach((func) => {
    res[func] = new DataLoader(obj[func], { cache: false });
  });

  return res;
}


module.exports = {
  Actor: initLoader(Actor),
  Director: initLoader(Director)
};
