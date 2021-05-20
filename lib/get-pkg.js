const readPkg = require('read-pkg');
const AggregateError = require('aggregate-error');
const getError = require('./get-error');

module.exports = async ({location}) => {
  try {
    const pkg = await readPkg({cwd: location});

    if (!pkg.name) {
      throw getError('ENOPKGNAME');
    }

    return pkg;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new AggregateError([getError('ENOPKG')]);
    }

    throw new AggregateError([error]);
  }
};
