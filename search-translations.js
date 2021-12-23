const path = require('path');
const fs = require('fs');

console.log('Running search-translations...');

const directoryPath = path.join(__dirname, process.argv[2]);
const allFiles = walk(directoryPath);
const files = allFiles.filter((f) => !f.includes('messages_'));
const translationFile = allFiles.filter((f) => f.includes('messages_en'))[0];
const allKeys = getAllKeys(translationFile);

const usedKeys = new Set(files.flatMap(getKeysInFile));
const unusedKeys = allKeys.filter((key) => !usedKeys.has(key));
console.log('Unused keys:');
console.log('----------------------------------------------------------------');
console.log(unusedKeys.join('\n'));
console.log('----------------------------------------------------------------');

function getKeysInFile(file) {
  const data = fs.readFileSync(file, 'utf8');
  return allKeys.filter((key) => data.includes(key));
}

function walk(startPath) {
  if (!fs.lstatSync(startPath).isDirectory()) {
    return [startPath];
  }
  return fs
    .readdirSync(startPath)
    .map((p) => path.join(startPath, p))
    .flatMap(walk);
}

function getAllKeys(translationFile) {
  const data = fs.readFileSync(translationFile, 'utf8');
  return Object.keys(JSON.parse(data));
}
