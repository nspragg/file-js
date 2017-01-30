import fsp from 'fs-ext';
import Promise from 'bluebird';

module.exports = Promise.promisifyAll(fsp);
