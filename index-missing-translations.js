const path = require('path');
const fs = require('fs');

const { getFileNames } = require('./index-utils');

module.exports = checkMissingTranslations;

function checkMissingTranslations(translationsPath) {
  const files = getFileNames(translationsPath)
    .filter(file => !file.endsWith('_en.json'));
  
  const arFilePath = path.join(translationsPath, 'messages_ar.json');
  if (!fs.existsSync(arFilePath)) {
    return {};
  }

  const arJson = readAsJson(arFilePath);

  return files.reduce((result, file) => {
    const json = readAsJson(path.join(translationsPath, file));
    Object.keys(json).forEach(key => {
      if (json[key] === arJson[key]) {
        result[file] = result[file] || {};
        result[file][key] = json[key];
      }
    });
    return result;
  }, {});
}

function readAsJson(file) {
  return JSON.parse(fs.readFileSync(file, { encoding: 'UTF8' }));
}
