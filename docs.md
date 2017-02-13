# file-js

[![Build Status](https://travis-ci.org/nspragg/file-js.svg)](https://travis-ci.org/nspragg/file-js) [![Coverage Status](https://coveralls.io/repos/github/nspragg/file-js/badge.svg?branch=master)](https://coveralls.io/github/nspragg/file-js?branch=master)

> Abstract representation of a pathname

## Installation

```
npm install --save file-js
```

## Common examples

The example below list all files

```js
const File = require('file-js');

const file = File.create('myDir');
file.getList()
  then((files) => {
    files.each(console.log);
  });
```

#### Type checking

```js
const pathname = File.create('myFile');
if (pathname.isFile()) {
  console.log(`process ${pathname}`)
}
```

#### List files for a directory

Synchronously list files:
```js
const dir = File.create('myDirectory');
const files = dir.getListSync()

console.log(files.forEach(console.log));
```

Asynchronously list files:
```js
const dir = File.create('myDirectory');
dir.getList().each(console.log);
```

#### File locking

Perform operations on a file whilst locked:
```js
const fs = require('fs');
const file = File.create('myFile');

file.withLock(() => {
  file.isWritable((w_ok) => {
    if (w_ok) {
      fs.writeFileSync(file.getAbsolutePath(), 'my data\n');
    }
  });
});
```
#### Check permissions

Check that a pathname has write permission:
```js
const file = File.create('myFile');
file.isWritable((isWritable) => {
  if (isWritable) {
    console.log(`Able to write to ${file.getName()}`);
  }  
});
```

Check that a pathname is executable:
```js
const file = File.create('myFile');
file.isExecutable((isExecutable) => {
  if (isExecutable) {
    console.log(`Able to execute ${file.getName()}`);
  }
});
```

#### Pathname changes and access

Get the last time a pathname was modified:
```js
const file = File.create('myFile');
const lastModified = file.lastModifiedSync();

console.log(`${file.getName()} was last modified on ${lastModified}`);
```

Get the last time a pathname was accessed:
```js
const file = File.create('myFile');
const lastAccessed = file.lastAccessedSync();

console.log(`${file.getName()} was last accessed on ${lastAccessed}`);
```

#### File size

Check a file is less than 1k:

```js
const file = File.create('myFile');
if (file.sizeSync() < 1024) {
  console.log(`${file.getName()} < 1k`);
}
```

#### Supports callbacks

Get list of files for a directory:

```js
const dir = File.create('myDir');
dir.getList((err, files) => {
  if (err) return console.error(err);

  console.log(files);
});
```
