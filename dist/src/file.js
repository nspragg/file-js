"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as Promise from 'bluebird';
const path = require("path");
const fileGlob = require("minimatch");
const util = require("util");
const bluebird = require("bluebird");
const fs_1 = require("fs");
const statAsync = util.promisify(fs_1.stat);
const accessAsync = util.promisify(fs_1.access);
const readdirAsync = bluebird.promisify(fs_1.readdir);
const unlinkAsync = util.promisify(fs_1.unlink);
function joinWith(dir) {
    return (file) => {
        return path.join(dir, file);
    };
}
/**
 * @class
 */
class File {
    constructor(pathname) {
        this.dir = process.cwd();
        this.pathname = pathname;
    }
    getStatsSync() {
        return fs_1.statSync(this.pathname);
    }
    getStats() {
        console.log(this.pathname);
        return statAsync(this.pathname);
    }
    isHiddenFile() {
        return (/^\./).test(path.basename(this.pathname));
    }
    isHiddenDirectory() {
        return (/(^|\/)\.[^\/\.]/g).test(this.pathname);
    }
    depth(pathname) {
        return pathname.split(path.sep).length - 1;
    }
    access(permission) {
        let hasPermission = true;
        return accessAsync(this.pathname, permission)
            .catch(() => hasPermission = false)
            .then(() => hasPermission);
    }
    checkAsyncStats(type) {
        // return this.getStats().then(stats => stats[type]());
        return this.getStats().then((stats) => {
            console.log(stats);
            stats[type]();
        });
    }
    /**
     * Synchronously determine if pathname is a directory
     *
     * @instance
     * @memberOf File
     * @method
     * isDirectorySync
     * @return boolean
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('myDirectory');
     * if (file.isDirectorySync()) {
     *    console.log('processing directory');
     * }
     */
    isDirectorySync() {
        return this.getStatsSync().isDirectory();
    }
    /**
     * Synchronously determine if pathname is a socket
     *
     * @instance
     * @memberOf File
     * @method
     * isSocketSync
     * @return boolean
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('mysocket');
     * if (file.isSocketSync()) {
     *    console.log('processing socket');
     * }
     */
    isSocketSync() {
        return this.getStatsSync().isSocket();
    }
    /**
     * Synchronously determine if pathname is a file
     *
     * @instance
     * @memberOf File
     * @method
     * isFileSync
     * @return boolean
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('myDirectory');
     * if (file.isFileSync()) {
     *    console.log('processing file');
     * }
     */
    isFileSync() {
        return this.getStatsSync().isFile();
    }
    /**
     * Determine if pathname is a directory
     *
     * @instance
     * @memberOf File
     * @method
     * isDirectory
     * @return If the Promise fulfils, the fulfilment value is
     * a boolean indicating if the pathname is a directory
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('myDirectory');
     * file.isDirectory((isDirectory) => {
     *   console.log(isDirectory);
     * });
     *
     */
    isDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.checkAsyncStats('isDirectory');
        });
    }
    /**
     * Determine if pathname is a Socket
     *
     * @instance
     * @memberOf File
     * @method
     * isSocket
     * @return If the Promise fulfils, the fulfilment value is
     * a boolean indicating if the pathname is a Socket
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('mySocket');
     * file.isSocket((isSocket) => {
     *   console.log(isSocket);
     * });
     *
     */
    isSocket() {
        return this.checkAsyncStats('isSocket');
    }
    /**
     * Determine if pathname is a file
     *
     * @instance
     * @memberOf File
     * @method
     * isDirectory
     * @return If the Promise fulfils, the fulfilment value is
     * a boolean indicating if the pathname is a file
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('myDirectory');
     * file.isFile((isFile) => {
     *   console.log(isFile);
     * });
     */
    isFile() {
        return this.checkAsyncStats('isFile');
    }
    /**
     * Synchronously determine if pathname is a hidden file
     *
     * @instance
     * @memberOf File
     * @method
     * isHiddenSync
     * @return boolean
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('./myHiddenFile');
     * if (file.isHiddenSync()) {
     *    console.log('processing hidden file');
     * }
     */
    isHiddenSync() {
        if (!this.isDirectorySync()) {
            return this.isHiddenFile();
        }
        return this.isHiddenDirectory();
    }
    /**
     * Determine if pathname is a file
     *
     * @instance
     * @memberOf File
     * @method
     * isDirectory
     * @return If the Promise fulfils, the fulfilment value is
     * a boolean indicating if the pathname is a file
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('myDirectory');
     * file.isFile((isFile) => {
     *   console.log(isFile);
     * });
     */
    isHidden() {
        return this.isDirectory()
            .then((isDirectory) => {
            if (!isDirectory) {
                return this.isHiddenFile();
            }
            return this.isHiddenDirectory();
        });
    }
    /**
     * Synchronously get list of files, if pathname is a directory
     *
     * @instance
     * @memberOf File
     * @method
     * getListSync
     * @return array of files
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('./myHiddenFile');
     * const files = file.getListSync();
     * console.log(files);
     */
    getListSync() {
        if (this.isDirectorySync()) {
            return fs_1.readdirSync(this.pathname).map((file) => {
                return path.join(this.pathname, file);
            });
        }
        return null;
    }
    /**
     * Get list of file objects, if pathname is a directory
     *
     * @instance
     * @memberOf File
     * @method
     * getList
     * @param {string=} glob - file glob
     * @return a promise. If the Promise fulfils, the fulfilment value is
     * a list of pathnames
     * @example
     * import File from 'file-js';
     *
     * // get all json files
     * const file = File.create('./myDirectory');
     * file.getFiles('*.json')
     * .then((jsonFiles) => {
     *    console.log(jsonFiles);
     * });
     */
    getList(glob) {
        return this.getFiles(glob)
            .then((list) => {
            if (!list)
                return [];
            return list.map(pathname => pathname.getName());
        });
    }
    /**
     * Get list of file objects, if pathname is a directory
     *
     * @instance
     * @memberOf File
     * @param {string=} glob - file glob
     * @method
     * getFiles
     * @return a promise. If the Promise fulfils, the fulfilment value is
     * a list of File objects
     * @example
     * import File from 'file-js';
     *
     * // get last modified time of all json files
     * const file = File.create('./myDirectory');
     * file.getFiles('*.json')
     * .then((jsonFiles) => {
     *    console.log(jsonFiles.map(file => file.lastModifiedSync()));
     * });
     */
    getFiles(glob) {
        if (!this.isDirectory())
            return Promise.resolve(null);
        const results = readdirAsync(this.pathname)
            .map(joinWith(this.pathname))
            .then((list) => {
            if (!list)
                return Promise.resolve(null);
            return list.map(pathname => new File(pathname));
        });
        if (glob)
            return results.filter(file => file.isMatch(glob));
        return results;
    }
    /**
     * Synchronously get list of file objects, if pathname is a directory
     *
     * @instance
     * @memberOf File
     * @method
     * getFileSync
     * @return array of files
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('./myHiddenFile');
     * const files = file.getFileSync();
     * console.log(files);
     */
    getFilesSync(glob) {
        if (this.isDirectorySync()) {
            const files = this.getListSync()
                .map((pathname) => {
                return new File(pathname);
            });
            if (glob)
                return files.filter(file => file.isMatch(glob));
            return files;
        }
        return null;
    }
    /**
     * Synchronously calculate the depth of a directory
     *
     * @instance
     * @memberOf File
     * @method
     * getDepthSync
     * @return boolean
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('myDirectory');
     * console.log(file.getDepthSync());
     */
    getDepthSync() {
        if (!this.isDirectorySync()) {
            return this.depth(path.dirname(this.pathname));
        }
        return this.depth(this.pathname);
    }
    /**
     * Returns the pathname as a string
     *
     * @instance
     * @memberOf File
     * @method
     * getName
     * @return String
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('myDirectory');
     * console.log(file.getName());
     */
    getName() {
        return this.pathname;
    }
    /**
     * Returns the absolutePath
     *
     * @instance
     * @memberOf File
     * @method
     * getAbsolutePath
     * @return String
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('myFile');
     * console.log(file.getAbsolutePath());
     */
    getAbsolutePath() {
        if (path.isAbsolute(this.pathname)) {
            return this.pathname;
        }
        return [this.dir, this.pathname].join(path.sep);
    }
    /**
     * Returns the canonical path
     *
     * @instance
     * @memberOf File
     * @method
     * getCanonicalPath
     * @return String
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('myFile');
     * console.log(file.getCanonicalPath());
     */
    getCanonicalPath() {
        return path.normalize(this.getAbsolutePath());
    }
    /**
     * Returns the file extension.
     *
     * @instance
     * @memberOf File
     * @method
     * getPathExtension
     * @return String
     * @example
     * import File from 'file-js';
     *
     * const file = File.create('./tmp.sh');
     * console.log(file.getPathExtension()); // sh
     */
    getPathExtension() {
        return path.extname(this.pathname).substring(1);
    }
    isMatch(globPattern) {
        const glob = new fileGlob.Minimatch(globPattern, {
            matchBase: true
        });
        return glob.match(this.pathname);
    }
    lastModifiedSync() {
        return this.getStatsSync()['mtime'];
    }
    lastAccessedSync() {
        return this.getStatsSync()['atime'];
    }
    lastChangedSync() {
        return this.getStatsSync()['ctime'];
    }
    sizeSync() {
        return this.getStatsSync().size;
    }
    isWritable() {
        return this.access(fs_1.constants.W_OK);
    }
    isReadable() {
        return this.access(fs_1.constants.R_OK);
    }
    isExecutable() {
        return this.access(fs_1.constants.X_OK);
    }
    delete() {
        return unlinkAsync(this.pathname);
    }
}
exports.File = File;
