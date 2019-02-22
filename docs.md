# file-js

[![Build Status](https://travis-ci.org/nspragg/file-js.svg)](https://travis-ci.org/nspragg/file-js) [![Coverage Status](https://coveralls.io/repos/github/nspragg/file-js/badge.svg?branch=master)](https://coveralls.io/github/nspragg/file-js?branch=master)

> Abstract representation of a pathname

## Installation

```
npm install --save file-js
```

## Common examples

The example below lists all files in `myDir`

```js
const File = require('file-js');

const files = await new File('myDir').getList();
files.forEach(console.log);
```

#### Check file types

```js
const pathname = new File('myFile');
if (await pathname.isFile()) {
  console.log(`process ${pathname}`)
}
```

#### List files for a directory

Synchronously list files:
```js
const dir = new File('myDirectory');
const files = dir.getListSync()

console.log(files.forEach(console.log));
```

Asynchronously list files:
```js
const dir = new File('myDirectory');
dir.getList().forEach(console.log);
```

#### Check permissions

Check that a pathname has write permission:
```js
const file = new File('myFile');
if (await file.isWritable()) {
    console.log(`Able to write to ${file.getName()}`);
}
```

Check that a pathname is executable:
```js
const file = new File('myFile');
if (await file.isExecutable()) {
    console.log(`Able to execute ${file.getName()}`);
}
```

#### Pathname changes and access

Get the last time a pathname was modified:
```js
const file = new File('myFile');
const lastModified = file.lastModifiedSync();

console.log(`${file.getName()} was last modified on ${lastModified}`);
```

Get the last time a pathname was accessed:
```js
const file = new File('myFile');
const lastAccessed = file.lastAccessedSync();

console.log(`${file.getName()} was last accessed on ${lastAccessed}`);
```

#### File size

Check a file is less than 1k:

```js
const file = new File('myFile');
if (file.sizeSync() < 1024) {
  console.log(`${file.getName()} < 1k`);
}
```

#### Recursive delete

Deletes a folder and all of its contents:

```js
const file = new File('myDir/');
file.deleteRecursively()
  .then(() => console.log('myDir/ deleted'))
  .catch(console.error);
```

#### Recursive copy

Copies a folder and all of its contents. Optionally overwriting an existing destination:

If `destinationDir/` already exists, you will not be able to copy:
```js
const file = new File('sourceDir/');
file.copyRecursively('destinationDir/')
  .then(() => console.log('sourceDir/ copied to destinationDir/'))
  .catch(console.error); // message: 'Directory: "destinationDir/" already exists.'
```

If `destinationDir/` already exists and you want to overwrite it:
```js
const file = new File('sourceDir/');
file.copyRecursively('destinationDir/', { overwrite: true })
  .then(() => console.log('sourceDir/ copied to destinationDir/'))
  .catch(console.error);
```
