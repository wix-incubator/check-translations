const path = require('path');
const fs = require('fs');

module.exports = check;

function check(translationsPath) {
  const files = fs.readdirSync(translationsPath);
  const enFile = files.find(name => name.endsWith('_en.json'));

  const content = readFiles(files.map(file => path.join(translationsPath, file)));
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

function readFiles(files) {
  return files.reduce((acc, curr) => ({...acc, [path.basename(curr)]: read(curr)}), {});
}

function read(file) {
  const json = JSON.parse(fs.readFileSync(file, { encoding: 'UTF8' }));
  return Object.keys(json).reduce((acc, curr) => {
    return Object.assign(acc, {
      [curr]: (json[curr].match(/{{[^{}]*}}/g) || []).sort().join(', ')
    });
  }, {});
}
