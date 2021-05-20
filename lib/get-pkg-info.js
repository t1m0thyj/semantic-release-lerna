const path = require('path');
const execa = require('execa');
const AggregateError = require('aggregate-error');

module.exports = async ({pkgRoot}, {cwd}) => {
  try {
    const basePath = pkgRoot ? path.resolve(cwd, String(pkgRoot)) : cwd;
    const packageInfo = JSON.parse((await execa('npx', ['lerna', 'list', '--json', '--toposort'],
      { cwd: basePath })).stdout);
    const changedPackages = (await execa('npx', ['lerna', 'changed', '--include-merged-tags'],
      { cwd: basePath, reject: false })).stdout.split(/\r?\n/);

    for (const pkg of packageInfo) {
      pkg.changed = changedPackages.includes(pkg.name);
    }

    return packageInfo;
  } catch (error) {
    throw new AggregateError([error]);
  }
};
