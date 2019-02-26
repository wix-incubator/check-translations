const path = require('path');
const fs = require('fs');
const packageJson = require(path.join(process.cwd(), 'package.json'));

if (packageJson.devDependencies['non-existing-unique-package-should-fail']) {
  console.log('exiting..., cause wrong dep...');
  delete packageJson.devDependencies['non-existing-unique-package-should-fail'];
  console.log('updating package.json with new deps...', JSON.stringify(packageJson));
  fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(packageJson, null, 2));
  process.exit(1);
}
