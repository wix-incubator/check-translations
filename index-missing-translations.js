const path = require('path');
const fs = require('fs');

const { getFileNames } = require('./index-utils');

module.exports = checkMissingTranslations;

function checkMissingTranslations(translationsPath) {
  const files = getFileNames(translationsPath)
    .filter(file => !file.endsWith('_en.json'));
  
  const arFile = files.find(name => name.endsWith('_ar.json'));
  if (!arFile) {
    return {};
  }

  const arJson = require(path.join(translationsPath, file));

  return files.reduce((result, file) => {
    const json = require(path.join(translationsPath, file));
    Object.keys(json).forEach(key => {
      if (json[key] === arJson[key]) {
        result[file] = result[file] || {};
        result[file][key] = json[key];
      }
    });
    return result;
  }, {});
}
