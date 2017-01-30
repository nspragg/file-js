import Promise from 'bluebird';
import path from 'path';
import fileGlob from 'minimatch';

import fs from './fs';

const fsp = Promise.promisifyAll(fs);
const LOCK_EX = 'ex';
const LOCK_UN = 'un';
const READ_ONLY = 'r';

function joinWith(dir) {
  return (file) => {
    return path.join(dir, file);
  };
}

class File {
  constructor(pathname) {
    this._dir = process.cwd();
    this._pathname = pathname;
  }

  _getStatsSync() {
    return fs.statSync(this._pathname);
  }

  _getStats() {
    return fsp.statAsync(this._pathname);
  }

  _isHiddenFile() {
    return (/^\./).test(path.basename(this._pathname));
  }

  _isHiddenDirectory() {
    return (/(^|\/)\.[^\/\.]/g).test(this._pathname);
  }

  _depth(pathname) {
    return pathname.split(path.sep).length - 1;
  }

  _access(permission) {
    let hasPermission = true;

    return fsp.accessAsync(this._pathname, permission)
      .catch(() => hasPermission = false)
      .then(() => hasPermission);
  }

  _checkAsyncStats(type) {
    return this._getStats().then((stats) => stats[type]());
  }

  isDirectorySync() {
    return this._getStatsSync().isDirectory();
  }

  isFileSync() {
    return this._getStatsSync().isFile();
  }

  isDirectory() {
    return this._checkAsyncStats('isDirectory');
  }

  isFile() {
    return this._checkAsyncStats('isFile');
  }

  isHiddenSync() {
    if (!this.isDirectorySync()) {
      return this._isHiddenFile();
    }
    return this._isHiddenDirectory();
  }

  isHidden() {
    this.isDirectory()
      .then((isDirectory) => {
        if (!isDirectory) {
          return this._isHiddenFile();
        }
        return this._isHiddenDirectory();
      });
  }

  getListSync() {
    if (this.isDirectorySync()) {
      return fs.readdirSync(this._pathname).map((file) => {
        return path.join(this._pathname, file);
      });
    }
    return null;
  }

  getList() {
    return this.isDirectory()
      .then((isDirectory) => {
        if (isDirectory) {
          return fsp.readdirAsync(this._pathname).map(joinWith(this._pathname));
        }
        return null;
      });
  }

  getDepthSync() {
    if (!this.isDirectorySync()) {
      return this._depth(path.dirname(this._pathname));
    }
    return this._depth(this._pathname);
  }

  getName() {
    return this._pathname;
  }

  getAbsolutePath() {
    if (path.isAbsolute(this._pathname)) {
      return this._pathname;
    }
    return [this._dir, this._pathname].join(path.sep);
  }

  getCanonicalPath() {
    return path.normalize(this.getAbsolutePath());
  }

  getPathExtension() {
    return path.extname(this._pathname).substring(1);
  }

  isMatch(globPattern) {
    const glob = new fileGlob.Minimatch(globPattern, {
      matchBase: true
    });
    return glob.match(this._pathname);
  }

  lastModifiedSync() {
    return this._getStatsSync()['mtime'];
  }

  lastAccessedSync() {
    return this._getStatsSync()['atime'];
  }

  lastChangedSync() {
    return this._getStatsSync()['ctime'];
  }

  sizeSync() {
    return this._getStatsSync().size;
  }

  isWritable() {
    return this._access(fs.W_OK);
  }

  isReadable() {
    return this._access(fs.R_OK);
  }

  isExecutable() {
    return this._access(fs.X_OK);
  }

  delete() {
    return fsp.unlinkAsync(this._pathname);
  }

  withLock(fn) {
    let fd;
    return fs.openAsync(this._pathname, READ_ONLY)
      .then((_fd) => {
        fd = _fd;
        return fs.flockAsync(fd, LOCK_EX).then(() => fn());
      })
      .finally(() => {
        fs.flockAsync(fd, LOCK_UN);
      });
  }
}

module.exports.create = (filename) => {
  return new File(filename);
};
