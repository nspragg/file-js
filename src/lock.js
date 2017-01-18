import lockfile from 'lockfile';
import Promise from 'bluebird';

module.exports = Promise.promisifyAll(lockfile);
