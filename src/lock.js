import lock from 'proper-lockfile';
import Promise from 'bluebird';

module.exports = Promise.promisifyAll(lock);
