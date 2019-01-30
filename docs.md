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
