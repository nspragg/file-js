import fs from 'fs';
import Promise from 'bluebird';

module.exports = Promise.promisifyAll(fs);
