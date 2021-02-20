const fs = require('fs');

module.exports.getFileNames = getFileNames;

const supportedLocales = [
  'en',
  'zh',
  'cs',
  'da',
  'nl',
  'fr',
  'de',
  'hi',
  'it',
  'ja',
  'ko',
  'no',
  'pl',
  'pt',
  'ru',
  'es',
  'sv',
  'th',
  'tr',
  'uk',
  'vi',
];

function getFileNames(translationsPath) {
  return fs
    .readdirSync(translationsPath)
    .filter(file => {
      return supportedLocales.some(locale => {
        return file.endsWith(`_${locale}.json`);
      });
    });
}
