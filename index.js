const path = require('path');
const fs = require('fs');

const { getFileNames } = require('./index-utils');

module.exports = check;

function check(translationsPath, ignoreKeys) {
  const files = getFileNames(translationsPath);
  const enFile = files.find(name => name.endsWith('_en.json'));

  const content = readFiles(files.map(file => path.join(translationsPath, file)), ignoreKeys);
  const en = content[enFile];

  const messages = [];

  Object.keys(content).forEach(function (file) {
    Object.keys(content[file]).forEach(function (key) {
      if (typeof en[key] === 'undefined') {
        messages.push({
          file,
          type: 'WARNING',
          code: 'EXTRANEOUS_TRANSLATION_FOUND',
          translation: {
            key
          }
        });
      } else if (content[file][key] !== en[key]) {
        messages.push({
          file,
          type: 'ERROR',
          code: 'CORRUPTED_TRANSLATION',
          translation: {
            key,
            params: content[file][key],
            baseLineParams: en[key]
          }
        });
      }
    });
  });

  return messages;
}

function readFiles(files, ignoreKeys) {
  return files.reduce(function (acc, curr) {
    return Object.assign(acc, {
      [path.basename(curr)]: read(curr, ignoreKeys)
    });
  }, {});
}

function read(file, ignoreKeys) {
  const json = JSON.parse(fs.readFileSync(file, { encoding: 'UTF8' }));
  return Object.keys(json).reduce(function (acc, curr) {
    return Object.assign(acc, {
      [curr]: (json[curr].match(/{{[^{}]*}}/g) || [])
        .filter(key => !ignoreKeys.includes(key)).sort().join(', ')
    });
  }, {});
}
