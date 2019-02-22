import { assert } from 'chai';
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import * as sinon from 'sinon';
import { File } from '../src/file';
import * as fsp from '../src/fsp';
import { TestStats } from './testStats';

const sandbox = sinon.sandbox.create();

interface DateOpts {
  duration?: any;
  modifier?: string;
}

function getFixturePath(file: string): string {
  return path.join(`${__dirname}/fixtures/`, file);
}

function getAbsolutePath(dir: string): string {
  return `${process.cwd()}/${dir}`;
}

function getCanonicalPath(relativePath: string): string {
  return path.normalize(getAbsolutePath(relativePath));
}

function qualifyNames(names: string[]): string[] {
  return names.map(getFixturePath);
}

function formatDate(date: moment.Moment): string {
  return date.format('DD/MM/YYYY');
}

function createFile(fname: string, opts: DateOpts): void {
  const time = new Date(moment().subtract(opts.duration, opts.modifier).toString());
  const fd = fs.openSync(fname, 'w+');
  fs.futimesSync(fd, time, time);
  fs.closeSync(fd);
}

function deleteFile(fname: string): void {
  fs.unlinkSync(fname);
}

function createFileStructure(fixturePath: string, depth: number = 5): void {
  let filePath = getFixturePath(fixturePath);
  for (let i = 0; i < depth; i++) {
    filePath = `${filePath}/subDir_${i}`;
    const subDirPath = filePath.split('fixtures', filePath.length)[1];
    const subFile = getFixturePath(`${subDirPath}/subFile_${i}.txt`);
    const anotherSubFile = getFixturePath(`${subDirPath}/anotherSubFile_${i}.txt`);
    fs.mkdirSync(filePath);
    createFile(subFile, {
      duration: 1,
      modifier: 'hours'
    });
    createFile(anotherSubFile, {
      duration: 1,
      modifier: 'hours'
    });
  }
}

describe('File', () => {
  afterEach(() => {
    sandbox.restore();
  });

  describe('.isDirectorySync', () => {
    it('returns true when a pathname is a directory', () => {
      const file = new File(getFixturePath('/justFiles'));
      assert.isTrue(file.isDirectorySync());
    });

    it('returns false when a pathname is not a directory', () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      assert(!file.isDirectorySync());
    });
  });

  describe('.isDirectory', () => {
    it('returns true when a pathname is a directory', async () => {
      const file = new File(getFixturePath('/justFiles'));
      const isDirectory = await file.isDirectory();
      assert.isTrue(isDirectory);
    });

    it('returns false when a pathname is not a directory', async () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      const isDirectory = await file.isDirectory();
      assert.isFalse(isDirectory);
    });
  });

  describe('.isSocketSync', () => {
    it('returns true when a pathname is a socket', () => {
      sandbox.stub(fs, 'statSync').returns(new TestStats());

      const file = new File(getFixturePath('/types/mySocketfile'));
      assert(file.isSocketSync());
    });

    it('returns false when a pathname is not a socket', () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      assert(!file.isSocketSync());
    });
  });

  describe('.isSocket', () => {
    it('returns true when a pathname is a Socket', async () => {
      sandbox.stub(fsp, 'stat').resolves(new TestStats());

      const file = new File(getFixturePath('/types/mySocketfile'));
      const isSocket = await file.isSocket();
      assert.isTrue(isSocket);
    });

    it('returns false when a pathname is not a Socket', async () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      const isSocket = await file.isSocket();
      assert.isFalse(isSocket);
    });
  });

  describe('.isFileSync', () => {
    it('returns true when a pathname is a file', () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      assert(file.isFileSync());
    });

    it('returns false when a pathname is not a file', () => {
      const file = new File(getFixturePath('/justFiles'));
      assert(!file.isFileSync());
    });
  });

  describe('.isFile', () => {
    it('returns true when a pathname is a file', async () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      const isFile = await file.isFile();
      assert.isTrue(isFile);
    });

    it('returns false when a pathname is not a file', async () => {
      const file = new File(getFixturePath('/justFiles'));
      const isFile = await file.isFile();
      assert.isFalse(isFile);
    });
  });

  describe('.getListSync', () => {
    it('returns a list of files for a given directory', () => {
      const file = new File(getFixturePath('/justFiles'));
      const files = file.getListSync();
      const expected = qualifyNames([
        'justFiles/a.json',
        'justFiles/b.json',
        'justFiles/dummy.txt'
      ]);

      assert.deepEqual(files, expected);
    });

    it('returns null when pathname is not a directory', () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      const files = file.getListSync();
      assert.strictEqual(files, null);
    });
  });

  describe('.getFiles', () => {
    it('returns a list of files objects for a given directory', async () => {
      const file = new File(getFixturePath('/justFiles'));
      const files = await file.getFiles();
      const expected = qualifyNames([
        'justFiles/a.json',
        'justFiles/b.json',
        'justFiles/dummy.txt'
      ]).map(pathname => new File(pathname));

      assert.deepEqual(files, expected);
    });

    it('returns a list of files using a file glob', async () => {
      const file = new File(getFixturePath('/justFiles'));
      const files = await file.getFiles('*.json');
      const expected = qualifyNames([
        'justFiles/a.json',
        'justFiles/b.json'
      ]).map(pathname => new File(pathname));

      assert.deepEqual(files, expected);
    });

    it('returns an empty array when pathname is not a directory', async () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      const files = await file.getFiles();
      assert.deepEqual(files, []);
    });
  });

  describe('.getFilesSync', () => {
    it('returns a list of files objects for a given directory', () => {
      const file = new File(getFixturePath('/justFiles'));
      const files = file.getFilesSync();
      const expected = qualifyNames([
        'justFiles/a.json',
        'justFiles/b.json',
        'justFiles/dummy.txt'
      ]).map(pathname => new File(pathname));

      assert.deepEqual(files, expected);
    });

    it('returns a list of files using a file glob', () => {
      const file = new File(getFixturePath('/justFiles'));
      const files = file.getFilesSync('*.json');
      const expected = qualifyNames([
        'justFiles/a.json',
        'justFiles/b.json'
      ]).map(pathname => new File(pathname));

      assert.deepEqual(files, expected);
    });

    it('returns null when pathname is not a directory', () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      const files = file.getFilesSync();
      assert.strictEqual(files, null);
    });
  });

  describe('.getList', () => {
    it('returns a list of files for a given directory', async () => {
      const file = new File(getFixturePath('/justFiles'));
      const files = await file.getList();
      const expected = qualifyNames([
        'justFiles/a.json',
        'justFiles/b.json',
        'justFiles/dummy.txt'
      ]);

      assert.deepEqual(files, expected);
    });

    it('returns an empty array when pathname is not a directory', async () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      const files = await file.getList();
      assert.deepEqual(files, []);
    });
  });

  describe('.isHiddenSync', () => {
    it('returns true when the file is hidden', () => {
      const hiddenPaths = [
        './test/fixtures/visibility/.hidden.json',
        './test/fixtures/visibility/.hidden/.hidden.json'
      ];
      hiddenPaths.forEach((hiddenPath) => {
        const file = new File(hiddenPath);
        assert.strictEqual(file.isHiddenSync(), true);
      });
    });

    it('returns false when the file is visible', () => {
      const visiblePaths = [
        './test/fixtures/visibility/visible.json',
        './test/fixtures/visibility/.hidden/visible.json',
        './test/fixtures/visibility/visible'
      ];
      visiblePaths.forEach((visiblePath) => {
        const file = new File(visiblePath);
        assert.strictEqual(file.isHiddenSync(), false);
      });
    });
  });

  describe('.isHidden', () => {
    it('returns true when the file is hidden', async () => {
      const file = new File('./test/fixtures/visibility/.hidden.json');
      const isHidden = await file.isHidden();
      assert.isTrue(isHidden);
    });

    it('returns false when the file is visible', async () => {
      const file = new File('./test/fixtures/visibility/');
      const isHidden = await file.isHidden();
      assert.isFalse(isHidden);
    });
  });

  describe('.getDepthSync', () => {
    it('returns the depth of a directory', () => {
      const file = new File('./test/fixtures/justFiles');
      assert.equal(file.getDepthSync(), 3);
    });

    it('returns the depth of a file', () => {
      const file = new File('./test/fixtures/justFiles/a.json');
      assert.equal(file.getDepthSync(), 3);
    });
  });

  describe('.getPathExtension', () => {
    it('returns the extension for a file', () => {
      const file = new File(getFixturePath('/justFiles/a.json'));
      assert.equal(file.getPathExtension(), 'json');
    });

    it('returns the extension for a directory', () => {
      const file = new File(getFixturePath('/test.d'));
      assert.equal(file.getPathExtension(), 'd');
    });
  });

  describe('.isMatch', () => {
    it('returns true if the pathname is a match for a given glob', async () => {
      const paths = [
        ['./test/fixtures/justFiles/a.json', '*.json'],
        ['./test/fixtures/justFiles', '*justFiles*']
      ];
      paths.forEach(async (testCase) => {
        const [pathname, glob] = testCase;
        const file = new File(pathname);
        assert.isTrue(await file.isMatch(glob));
      });
    });

    it('returns false if the pathname is not a match for a given glob', async () => {
      const paths = [
        ['./test/fixtures/justFiles/a.txt', '*.json'],
        ['./test/fixtures', '*justFiles*']
      ];
      paths.forEach(async (testCase) => {
        const [pathname, glob] = testCase;
        const file = new File(pathname);
        assert.isFalse(await file.isMatch(glob));
      });
    });
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
        const pathname = new File(file.name);
        const actual = formatDate(moment(pathname.lastModifiedSync()));
        assert.equal(actual, formatDate(moment().subtract(file.modified, 'days')));
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
        const pathname = new File(file.name);
        const actual = formatDate(moment(pathname.lastAccessedSync()));
        const expectedDate = formatDate(moment().subtract(file.accessed, 'hours'));
        assert.equal(actual, expectedDate);
      });
    });
  });

  describe('.lastChangedSync', () => {
    let statSync;

    before(() => {
      fs.mkdirSync(getFixturePath('dates'));

      statSync = sandbox.stub(fs, 'statSync');
      statSync.returns({
        isDirectory(): boolean {
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
          isDirectory(): boolean {
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
        const pathname = new File(file.name);
        const actual = formatDate(moment(pathname.lastChangedSync()));
        const expectedDate = formatDate(moment().subtract(file.changed, 'hours'));
        assert.equal(actual, expectedDate);
      });
    });
  });

  describe('.sizeSync', () => {
    it('returns the size of a pathname in bytes', () => {
      const pathname = new File(getFixturePath('sizes/10b.txt'));
      assert.equal(pathname.sizeSync(), 10);
    });
  });

  describe('.getName', () => {
    it('returns the pathname representation by the object', () => {
      const file = new File(getFixturePath('dates/a.txt'));
      assert.equal(file.getName(), getFixturePath('dates/a.txt'));
    });
  });

  describe('.isWritable', () => {
    it('returns true when the file has write permission', async () => {
      const file = new File(getFixturePath('justFiles/a.json'));
      const isWritable = await file.isWritable();
      assert.isTrue(isWritable);
    });

    it('returns false when the file does not have write permission', async () => {
      fsp.chmodSync(getFixturePath('permissions/notWritable.json'), '444');
      const file = new File(getFixturePath('permissions/notWritable.json'));
      const isWritable = await file.isWritable();
      assert.isFalse(isWritable);
    });
  });

  describe('.exists', () => {
    it('returns true when the file exists', async () => {
      const file = new File(getFixturePath('permissions/readWrite.json'));
      const exists = await file.exists();
      assert.isTrue(exists);
    });

    it('returns false when the file does not exists', async () => {
      const file = new File(getFixturePath('permissions/bad.json'));
      const exists = await file.exists();
      assert.isFalse(exists);
    });
  });

  describe('.isReadable', () => {
    it('returns true when the file has read permission', async () => {
      const file = new File(getFixturePath('permissions/readWrite.json'));
      const isReadable = await file.isReadable();
      assert.isTrue(isReadable);
    });
  });

  describe('.isExecutable', () => {
    it('returns true when the file has read permission', async () => {
      const file = new File(getFixturePath('permissions/executable.sh'));
      const isExecutable = await file.isExecutable();
      assert.isTrue(isExecutable);
    });

    it('returns false when the file does not have read permission', async () => {
      const file = new File(getFixturePath('permissions/notExecutable.sh'));
      const isExecutable = await file.isExecutable();
      assert.isFalse(isExecutable);
    });
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

    it('deletes a file that exists', async () => {
      const file = new File(getFixturePath('delete/a.txt'));

      await file.delete();

      assert.throws(() => {
        fs.statSync(getFixturePath('delete/a.txt'));
      }, /ENOENT/);
    });
  });

  describe('.deleteRecursively', () => {
    before(() => {
      fs.mkdirSync(getFixturePath('delete'));
    });

    after(() => {
      if (fs.existsSync('delete')) {
        fs.rmdirSync(getFixturePath('delete'));
      }
    });

    const fileToDelete = getFixturePath('delete/a.txt');

    beforeEach(() => {
      createFile(fileToDelete, { duration: 1, modifier: 'hours' });
      createFileStructure('delete');
    });

    it('recursively deletes a folder and its contents', async () => {
      const file = new File(getFixturePath('delete/'));

      await file.deleteRecursively();

      assert.throws(() => {
        fs.statSync(getFixturePath('delete/'));
      }, /ENOENT/);
    });
  });

  describe('.copyRecursively', () => {
    let shallowCopySource;
    let deepCopySource;
    let destinationPath;

    const file = getFixturePath('shallowCopySource/a.txt');

    beforeEach(() => {
      fs.mkdirSync(getFixturePath('shallowCopySource'));
      createFile(file, { duration: 1, modifier: 'hours' });
      shallowCopySource = new File(getFixturePath('shallowCopySource/'));
      destinationPath = getFixturePath('copyDest/');
    });

    afterEach(async () => {
      await shallowCopySource.deleteRecursively();
      const destination = new File(destinationPath);
      await destination.deleteRecursively();
    });

    it('copies a directory and its contents to destination', async () => {
      await shallowCopySource.copyRecursively(destinationPath);

      assert.isTrue(fs.existsSync(destinationPath));
      assert.exists(fs.statSync(`${destinationPath}a.txt`));
    });

    it('deep copies a directory and its sub-contents to destination', async () => {
      fs.mkdirSync(getFixturePath('deepCopySource'));
      createFileStructure('deepCopySource', 5);
      deepCopySource = new File(getFixturePath('deepCopySource/'));

      await deepCopySource.copyRecursively(destinationPath);
      assert.isTrue(fs.existsSync(destinationPath));
      assert.isTrue(fs.existsSync(`${destinationPath}subDir_0`));

      await deepCopySource.deleteRecursively();
    });

    describe('overwrite', () => {
      beforeEach(() => {
        fs.mkdirSync(destinationPath);
        const existingFile = getFixturePath('copyDest/originalFile.txt');
        createFile(existingFile, { duration: 1, modifier: 'hours' });
      });

      context('true', () => {
        it('overwrites existing destination when copying', async () => {
          await shallowCopySource.copyRecursively(destinationPath, { overwrite: true });

          assert.isTrue(fs.existsSync(destinationPath));
          assert.exists(fs.statSync(`${destinationPath}a.txt`));
          assert.isFalse(fs.existsSync(`${destinationPath}originalFile.txt`));
        });
      });

      context('false', () => {
        it('does not overwrite existing destination when copying', async () => {
          try {
            await shallowCopySource.copyRecursively(destinationPath);
          } catch (error) {
            assert.strictEqual(error.message, `Directory: "${destinationPath}" already exists.`);
            return;
          }
          assert.fail();
          assert.isTrue(fs.existsSync(destinationPath));
          assert.isTrue(fs.existsSync(`${destinationPath}originalFile.txt`));
          assert.isFalse(fs.existsSync(`${destinationPath}a.txt`));
        });
      });
    });
  });

  describe('.getFixturePath', () => {
    it('returns the absolute path for a relative pathname', () => {
      const relativePath = './test/fixtures/justFiles/a.json';
      const file = new File(relativePath);
      assert.equal(file.getAbsolutePath(), getAbsolutePath(relativePath));
    });

    it('returns the absolute path for an absolute pathname', () => {
      const relativePath = './test/fixtures/justFiles/a.json';
      const absolutePath = getAbsolutePath(relativePath);
      const file = new File(absolutePath);
      assert.equal(file.getAbsolutePath(), absolutePath);
    });
  });

  describe('.getCanonicalPath', () => {
    it('returns the canonical path for a relative pathname', () => {
      const relativePath = './test/fixtures/justFiles/a.json';
      const file = new File(relativePath);
      assert.equal(file.getCanonicalPath(), getCanonicalPath('./test/fixtures/justFiles/a.json'));
    });

    it('returns the canonical path for an absolute pathname', () => {
      const relativePath = './test/fixtures/justFiles/a.json';
      const absolutePath = getAbsolutePath(relativePath);
      const canonicalPath = getCanonicalPath('./test/fixtures/justFiles/a.json');

      const file = new File(absolutePath);
      assert.equal(file.getCanonicalPath(), canonicalPath);
    });
  });

  describe('.getName', () => {
    it('returns the pathname representation by the object', () => {
      const file = new File(getFixturePath('dates/a.txt'));
      assert.equal(file.getName(), getFixturePath('dates/a.txt'));
    });
  });
});
