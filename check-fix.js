const path = require('path');
const packageJson = require(path.join(process.cwd(), 'package.json'));

if (packageJson.devDependencies['non-existing-unique-package-should-fail']) {
  console.log('exiting..., cause wrong dep...');
  process.exit(1);
}
