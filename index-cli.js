#!/usr/bin/env node

console.log('Running check-translations...');

const check = require('./index');

const path = process.argv[2];
const ignoreKeys = process.argv[3] ? process.argv[3].split(',') : [];

const result = check(path, ignoreKeys);

const warnings = result.filter(_ => _.type === 'WARNING');
const errors = result.filter(_ => _.type === 'ERROR');

warnings.forEach(warning => {
  console.warn(
    `${warning.type}: ${warning.code}, ${warning.file}, ${warning.translation.key}.`
  );
});

errors.forEach(error => {
  console.error([
    `${error.type}: ${error.code}, ${error.file}, ${error.translation.key}`,
    `expected to have parameters: "${error.translation.baseLineParams}"`,
    `but got: "${error.translation.params}".`
  ].join(' '));
});

if (errors.length) {
  process.exit(1);
}
