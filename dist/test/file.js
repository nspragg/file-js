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
const chai_1 = require("chai");
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const sinon = require("sinon");
const file_1 = require("../src/file");
const fsp = require("../src/fsp");
const testStats_1 = require("./testStats");
const sandbox = sinon.sandbox.create();
const nestedFiles = qualifyNames([
    '/nested/.hidden1/bad.txt',
    '/nested/c.json',
    'nested/d.json',
    '/nested/mydir/e.json'
]);
const jsonFiles = qualifyNames([
    '/nested/c.json',
    'nested/d.json',
    '/nested/mydir/e.json'
]);
const justFiles = qualifyNames([
    '/justFiles/',
    '/justFiles/a.json',
    '/justFiles/b.json',
    '/justFiles/dummy.txt'
]);
const justDirectories = qualifyNames([
    '/nested/',
    '/nested/.hidden1',
    '/nested/mydir'
]);
function getFixturePath(file) {
    return path.join(`${__dirname}/fixtures/`, file);
}
function getAbsolutePath(dir) {
    return `${process.cwd()}/${dir}`;
}
function getCanonicalPath(relativePath) {
    return path.normalize(getAbsolutePath(relativePath));
}
function qualifyNames(names) {
    return names.map(getFixturePath);
}
function formatDate(date) {
    return date.format('DD/MM/YYYY');
}
function createFile(fname, opts) {
    const time = new Date(moment().subtract(opts.duration, opts.modifier).toString());
    const fd = fs.openSync(fname, 'w+');
    fs.futimesSync(fd, time, time);
    fs.closeSync(fd);
}
function deleteFile(fname) {
    fs.unlinkSync(fname);
}
describe('File', () => {
    afterEach(() => {
        sandbox.restore();
    });
    describe('.isDirectorySync', () => {
        it('returns true when a pathname is a directory', () => {
            const file = new file_1.File(getFixturePath('/justFiles'));
            chai_1.assert.isTrue(file.isDirectorySync());
        });
        it('returns false when a pathname is not a directory', () => {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            chai_1.assert(!file.isDirectorySync());
        });
    });
    describe('.isDirectory', () => {
        it('returns true when a pathname is a directory', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles'));
            const isDirectory = yield file.isDirectory();
            chai_1.assert.isTrue(isDirectory);
        }));
        it('returns false when a pathname is not a directory', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            const isDirectory = yield file.isDirectory();
            chai_1.assert.isFalse(isDirectory);
        }));
    });
    describe('.isSocketSync', () => {
        it('returns true when a pathname is a socket', () => {
            sandbox.stub(fs, 'statSync').returns(new testStats_1.TestStats());
            const file = new file_1.File(getFixturePath('/types/mySocketfile'));
            chai_1.assert(file.isSocketSync());
        });
        it('returns false when a pathname is not a socket', () => {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            chai_1.assert(!file.isSocketSync());
        });
    });
    describe('.isSocket', () => {
        it('returns true when a pathname is a Socket', () => __awaiter(this, void 0, void 0, function* () {
            sandbox.stub(fsp, 'stat').resolves(new testStats_1.TestStats());
            const file = new file_1.File(getFixturePath('/types/mySocketfile'));
            const isSocket = yield file.isSocket();
            chai_1.assert.isTrue(isSocket);
        }));
        it('returns false when a pathname is not a Socket', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            const isSocket = yield file.isSocket();
            chai_1.assert.isFalse(isSocket);
        }));
    });
    describe('.isFileSync', () => {
        it('returns true when a pathname is a file', () => {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            chai_1.assert(file.isFileSync());
        });
        it('returns false when a pathname is not a file', () => {
            const file = new file_1.File(getFixturePath('/justFiles'));
            chai_1.assert(!file.isFileSync());
        });
    });
    describe('.isFile', () => {
        it('returns true when a pathname is a file', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            const isFile = yield file.isFile();
            chai_1.assert.isTrue(isFile);
        }));
        it('returns false when a pathname is not a file', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles'));
            const isFile = yield file.isFile();
            chai_1.assert.isFalse(isFile);
        }));
    });
    describe('.getListSync', () => {
        it('returns a list of files for a given directory', () => {
            const file = new file_1.File(getFixturePath('/justFiles'));
            const files = file.getListSync();
            const expected = qualifyNames([
                'justFiles/a.json',
                'justFiles/b.json',
                'justFiles/dummy.txt'
            ]);
            chai_1.assert.deepEqual(files, expected);
        });
        it('returns null when pathname is not a directory', () => {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            const files = file.getListSync();
            chai_1.assert.strictEqual(files, null);
        });
    });
    describe('.getFiles', () => {
        it('returns a list of files objects for a given directory', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles'));
            const files = yield file.getFiles();
            const expected = qualifyNames([
                'justFiles/a.json',
                'justFiles/b.json',
                'justFiles/dummy.txt'
            ]).map(pathname => new file_1.File(pathname));
            chai_1.assert.deepEqual(files, expected);
        }));
        it('returns a list of files using a file glob', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles'));
            const files = yield file.getFiles('*.json');
            const expected = qualifyNames([
                'justFiles/a.json',
                'justFiles/b.json'
            ]).map(pathname => new file_1.File(pathname));
            chai_1.assert.deepEqual(files, expected);
        }));
        it('returns an empty array when pathname is not a directory', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            const files = yield file.getFiles();
            chai_1.assert.deepEqual(files, []);
        }));
    });
    describe('.getFilesSync', () => {
        it('returns a list of files objects for a given directory', () => {
            const file = new file_1.File(getFixturePath('/justFiles'));
            const files = file.getFilesSync();
            const expected = qualifyNames([
                'justFiles/a.json',
                'justFiles/b.json',
                'justFiles/dummy.txt'
            ]).map(pathname => new file_1.File(pathname));
            chai_1.assert.deepEqual(files, expected);
        });
        it('returns a list of files using a file glob', () => {
            const file = new file_1.File(getFixturePath('/justFiles'));
            const files = file.getFilesSync('*.json');
            const expected = qualifyNames([
                'justFiles/a.json',
                'justFiles/b.json'
            ]).map(pathname => new file_1.File(pathname));
            chai_1.assert.deepEqual(files, expected);
        });
        it('returns null when pathname is not a directory', () => {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            const files = file.getFilesSync();
            chai_1.assert.strictEqual(files, null);
        });
    });
    describe('.getList', () => {
        it('returns a list of files for a given directory', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles'));
            const files = yield file.getList();
            const expected = qualifyNames([
                'justFiles/a.json',
                'justFiles/b.json',
                'justFiles/dummy.txt'
            ]);
            chai_1.assert.deepEqual(files, expected);
        }));
        it('returns an empty array when pathname is not a directory', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            const files = yield file.getList();
            chai_1.assert.deepEqual(files, []);
        }));
    });
    describe('.isHiddenSync', () => {
        it('returns true when the file is hidden', () => {
            const hiddenPaths = [
                './test/fixtures/visibility/.hidden.json',
                './test/fixtures/visibility/.hidden/.hidden.json'
            ];
            hiddenPaths.forEach((hiddenPath) => {
                const file = new file_1.File(hiddenPath);
                chai_1.assert.strictEqual(file.isHiddenSync(), true);
            });
        });
        it('returns false when the file is visible', () => {
            const visiblePaths = [
                './test/fixtures/visibility/visible.json',
                './test/fixtures/visibility/.hidden/visible.json',
                './test/fixtures/visibility/visible'
            ];
            visiblePaths.forEach((visiblePath) => {
                const file = new file_1.File(visiblePath);
                chai_1.assert.strictEqual(file.isHiddenSync(), false);
            });
        });
    });
    describe('.isHidden', () => {
        it('returns true when the file is hidden', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File('./test/fixtures/visibility/.hidden.json');
            const isHidden = yield file.isHidden();
            chai_1.assert.isTrue(isHidden);
        }));
        it('returns false when the file is visible', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File('./test/fixtures/visibility/');
            const isHidden = yield file.isHidden();
            chai_1.assert.isFalse(isHidden);
        }));
    });
    describe('.getDepthSync', () => {
        it('returns the depth of a directory', () => {
            const file = new file_1.File('./test/fixtures/justFiles');
            chai_1.assert.equal(file.getDepthSync(), 3);
        });
        it('returns the depth of a file', () => {
            const file = new file_1.File('./test/fixtures/justFiles/a.json');
            chai_1.assert.equal(file.getDepthSync(), 3);
        });
    });
    describe('.getPathExtension', () => {
        it('returns the extension for a file', () => {
            const file = new file_1.File(getFixturePath('/justFiles/a.json'));
            chai_1.assert.equal(file.getPathExtension(), 'json');
        });
        it('returns the extension for a directory', () => {
            const file = new file_1.File(getFixturePath('/test.d'));
            chai_1.assert.equal(file.getPathExtension(), 'd');
        });
    });
    describe('.isMatch', () => {
        it('returns true if the pathname is a match for a given glob', () => __awaiter(this, void 0, void 0, function* () {
            const paths = [
                ['./test/fixtures/justFiles/a.json', '*.json'],
                ['./test/fixtures/justFiles', '*justFiles*']
            ];
            paths.forEach((testCase) => __awaiter(this, void 0, void 0, function* () {
                const [pathname, glob] = testCase;
                const file = new file_1.File(pathname);
                chai_1.assert.isTrue(yield file.isMatch(glob));
            }));
        }));
        it('returns false if the pathname is not a match for a given glob', () => __awaiter(this, void 0, void 0, function* () {
            const paths = [
                ['./test/fixtures/justFiles/a.txt', '*.json'],
                ['./test/fixtures', '*justFiles*']
            ];
            paths.forEach((testCase) => __awaiter(this, void 0, void 0, function* () {
                const [pathname, glob] = testCase;
                const file = new file_1.File(pathname);
                chai_1.assert.isFalse(yield file.isMatch(glob));
            }));
        }));
    });
    describe('.lastModifiedSync', () => {
        before(() => {
            fs.mkdirSync(getFixturePath('dates'));
        });
        after(() => {
            fs.rmdirSync(getFixturePath('dates'));
        });
        const files = [
            {
                name: getFixturePath('dates/a.txt'),
                modified: 10
            },
            {
                name: getFixturePath('dates/w.txt'),
                modified: 9
            },
            {
                name: getFixturePath('dates/x.txt'),
                modified: 2
            },
            {
                name: getFixturePath('dates/y.txt'),
                modified: 1
            },
            {
                name: getFixturePath('dates/z.txt'),
                modified: 0
            }
        ];
        beforeEach(() => {
            files.forEach((file) => {
                createFile(file.name, {
                    duration: file.modified,
                    modifier: 'days'
                });
            });
        });
        afterEach(() => {
            files.forEach((file) => {
                deleteFile(file.name);
            });
        });
        it('returns the modified time of a given file', () => {
            files.forEach((file) => {
                const pathname = new file_1.File(file.name);
                const actual = formatDate(moment(pathname.lastModifiedSync()));
                chai_1.assert.equal(actual, formatDate(moment().subtract(file.modified, 'days')));
            });
        });
    });
    describe('.lastAccessedSync', () => {
        before(() => {
            fs.mkdirSync(getFixturePath('dates'));
        });
        after(() => {
            fs.rmdirSync(getFixturePath('dates'));
        });
        const files = [
            {
                name: getFixturePath('dates/a.txt'),
                accessed: 10
            },
            {
                name: getFixturePath('dates/w.txt'),
                accessed: 9
            },
            {
                name: getFixturePath('dates/x.txt'),
                accessed: 2
            },
            {
                name: getFixturePath('dates/y.txt'),
                accessed: 1
            },
            {
                name: getFixturePath('dates/z.txt'),
                accessed: 0
            }
        ];
        beforeEach(() => {
            files.forEach((file) => {
                createFile(file.name, {
                    duration: file.accessed,
                    modifier: 'hours'
                });
            });
        });
        afterEach(() => {
            files.forEach((file) => {
                deleteFile(file.name);
            });
        });
        it('returns the accessed time of a given file', () => {
            files.forEach((file) => {
                const pathname = new file_1.File(file.name);
                const actual = formatDate(moment(pathname.lastAccessedSync()));
                const expectedDate = formatDate(moment().subtract(file.accessed, 'hours'));
                chai_1.assert.equal(actual, expectedDate);
            });
        });
    });
    describe('.lastChangedSync', () => {
        let statSync;
        before(() => {
            fs.mkdirSync(getFixturePath('dates'));
            statSync = sandbox.stub(fs, 'statSync');
            statSync.returns({
                isDirectory() {
                    return true;
                }
            });
        });
        after(() => {
            fs.rmdirSync(getFixturePath('dates'));
            sandbox.restore();
        });
        const files = [
            {
                name: getFixturePath('dates/a.txt'),
                changed: 10
            },
            {
                name: getFixturePath('dates/w.txt'),
                changed: 9
            },
            {
                name: getFixturePath('dates/x.txt'),
                changed: 2
            },
            {
                name: getFixturePath('dates/y.txt'),
                changed: 1
            },
            {
                name: getFixturePath('dates/z.txt'),
                changed: 0
            }
        ];
        beforeEach(() => {
            files.forEach((file) => {
                createFile(file.name, {
                    duration: file.changed,
                    modifier: 'hours'
                });
                statSync.withArgs(file.name).returns({
                    ctime: moment().subtract(file.changed, 'hours'),
                    isDirectory() {
                        return false;
                    }
                });
            });
        });
        afterEach(() => {
            files.forEach((file) => {
                deleteFile(file.name);
            });
        });
        it('returns the last changed time of a given file', () => {
            files.forEach((file) => {
                const pathname = new file_1.File(file.name);
                const actual = formatDate(moment(pathname.lastChangedSync()));
                const expectedDate = formatDate(moment().subtract(file.changed, 'hours'));
                chai_1.assert.equal(actual, expectedDate);
            });
        });
    });
    describe('.sizeSync', () => {
        it('returns the size of a pathname in bytes', () => {
            const pathname = new file_1.File(getFixturePath('sizes/10b.txt'));
            chai_1.assert.equal(pathname.sizeSync(), 10);
        });
    });
    describe('.getName', () => {
        it('returns the pathname representation by the object', () => {
            const file = new file_1.File(getFixturePath('dates/a.txt'));
            chai_1.assert.equal(file.getName(), getFixturePath('dates/a.txt'));
        });
    });
    describe('.isWritable', () => {
        it('returns true when the file has write permission', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('justFiles/a.json'));
            const isWritable = yield file.isWritable();
            chai_1.assert.isTrue(isWritable);
        }));
        it('returns false when the file does not have write permission', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('permissions/notWritable.json'));
            const isWritable = yield file.isWritable();
            chai_1.assert.isFalse(isWritable);
        }));
    });
    describe('.isReadable', () => {
        it('returns true when the file has read permission', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('permissions/readWrite.json'));
            const isReadable = yield file.isReadable();
            chai_1.assert.isTrue(isReadable);
        }));
    });
    describe('.isExecutable', () => {
        it('returns true when the file has read permission', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('permissions/executable.sh'));
            const isExecutable = yield file.isExecutable();
            chai_1.assert.isTrue(isExecutable);
        }));
        it('returns false when the file does not have read permission', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('permissions/notExecutable.sh'));
            const isExecutable = yield file.isExecutable();
            chai_1.assert.isFalse(isExecutable);
        }));
    });
    describe('.delete', () => {
        before(() => {
            fs.mkdirSync(getFixturePath('delete'));
        });
        after(() => {
            fs.rmdirSync(getFixturePath('delete'));
        });
        const fileToDelete = getFixturePath('delete/a.txt');
        beforeEach(() => {
            createFile(fileToDelete, {
                duration: 1,
                modifier: 'hours'
            });
        });
        it('deletes a file that exists', () => __awaiter(this, void 0, void 0, function* () {
            const file = new file_1.File(getFixturePath('delete/a.txt'));
            yield file.delete();
            chai_1.assert.throws(() => {
                fs.statSync(getFixturePath('delete/a.txt'));
            }, /ENOENT/);
        }));
    });
    describe('.getFixturePath', () => {
        it('returns the absolute path for a relative pathname', () => {
            const relativePath = './test/fixtures/justFiles/a.json';
            const file = new file_1.File(relativePath);
            chai_1.assert.equal(file.getAbsolutePath(), getAbsolutePath(relativePath));
        });
        it('returns the absolute path for an absolute pathname', () => {
            const relativePath = './test/fixtures/justFiles/a.json';
            const absolutePath = getAbsolutePath(relativePath);
            const file = new file_1.File(absolutePath);
            chai_1.assert.equal(file.getAbsolutePath(), absolutePath);
        });
    });
    describe('.getCanonicalPath', () => {
        it('returns the canonical path for a relative pathname', () => {
            const relativePath = './test/fixtures/justFiles/a.json';
            const file = new file_1.File(relativePath);
            chai_1.assert.equal(file.getCanonicalPath(), getCanonicalPath('./test/fixtures/justFiles/a.json'));
        });
        it('returns the canonical path for an absolute pathname', () => {
            const relativePath = './test/fixtures/justFiles/a.json';
            const absolutePath = getAbsolutePath(relativePath);
            const canonicalPath = getCanonicalPath('./test/fixtures/justFiles/a.json');
            const file = new file_1.File(absolutePath);
            chai_1.assert.equal(file.getCanonicalPath(), canonicalPath);
        });
    });
    describe('.getName', () => {
        it('returns the pathname representation by the object', () => {
            const file = new file_1.File(getFixturePath('dates/a.txt'));
            chai_1.assert.equal(file.getName(), getFixturePath('dates/a.txt'));
        });
    });
});
