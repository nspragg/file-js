import * as fs from 'fs';
import * as util from 'util';

export const stat = util.promisify(fs.stat);
export const access = util.promisify(fs.access);
export const readdir = util.promisify(fs.readdir);
export const unlink = util.promisify(fs.unlink);
