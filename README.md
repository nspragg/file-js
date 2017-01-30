# file-js

[![Build Status](https://travis-ci.org/nspragg/file-js.svg)](https://travis-ci.org/nspragg/file-js) [![Coverage Status](https://coveralls.io/repos/github/nspragg/file-js/badge.svg?branch=master)](https://coveralls.io/github/nspragg/file-js?branch=master)

> Abstract representation of a pathname

* [Installation](#installation)
* [Features](#features)
* [Demo](#demo)
* [Usage](#usage)
* [API](#api)
* [Instance methods](#instance-methods)
* [Test](#test)
* [Contributing](#contributing)

## Installation

```
npm install --save file-js
```

## Features

* File glob matching
* File listings
* File locking
* Assert file permissions
* Supports promises
* Supports synchronous and asynchronous methods

## Coming soon

* File matching with regular expressions
* Support for callbacks

## Demo

<img src="" width="600"/>

## Usage

```js
const File = require('file-js');

const file = File.create('myFile');
file.getFiles()
  then((files) => {
    files.each(console.log);
  });

const file = File.create('myDirectory');
if (file.isDirectorySync()) {
  console.log('processing directory');
}
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
const files = dir.getFilesSync()

console.log(files.forEach(console.log));
```

Asynchronously list files:
```js
const dir = File.create('myDirectory');
dir.getFiles().each(console.log);
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
if (file.isWritable()) {
  console.log(`Able to write to ${file.getName()}`);
}
```

Check that a pathname is executable:
```js
const file = File.create('myFile');
if (file.isExecutable()) {
  console.log(`Able to execute ${file.getName()}`);
}
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
dir.getFiles((err, files) => {
  if (err) return console.error(err);

  console.log(files);
});
```

## API

### Static methods

### `File.create() -> File`

##### Parameters - None

##### Returns
Returns a File instance.

## Instance methods

### `.getFiles() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is an array of files in the directory or null if it's a file

### `.getFilesSync() -> Promise`
Synchronous version of `.getFiles()`

### `.isDirectory() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is is a boolean indicating if the pathname is a directory

### `.isDirectorySync() -> Promise`
Synchronous version of `.isDirectory()`

### `.isFile() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is is a boolean indicating if the pathname is a file

### `.isFileSync() -> Promise`
Synchronous version of `.isFile()`

### `.isHidden() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is is a boolean indicating if the pathname is hidden

### `.isHiddenSync() -> Promise`
Synchronous version of `.isHidden()`

### `.isMatch(globPattern) -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is is a boolean indicating if the pathname matches `globPattern`

### `.isMatchSync() -> Promise`
Synchronous version of `.isMatch()`

### `.lastAccessed() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is is a datetime when the file was last accessed

### `.lastAccessedSync() -> Promise`
Synchronous version of `.lastAccessed()`

### `.lastModified() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is is a datetime when the file was last modified

### `.lastModifiedSync() -> Promise`
Synchronous version of `.lastModified()`

### `.size() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is is the size of the file in bytes

### `.sizeSync() -> Promise`
Synchronous version of `.size()`

### `.isWritable() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is true is the file has write permissions

### `.isWritableSync() -> Promise`
Synchronous version of `.isWritable()`

### `.isReadable() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is true is the file has read permissions

### `.isReadableSync() -> Promise`
Synchronous version of `.isReadable()`

### `.isExecutable() -> Promise`

##### Parameters
* None

##### Returns
*  If the Promise fulfils, the fulfilment value is true is the file is executable

### `.isExecutableSync() -> Promise`
Synchronous version of `.isExecutable()`

### `.getName() -> String`

##### Parameters
* None

##### Returns
*  pathname as a string associated with the object

## Test

```
npm test
```

To generate a test coverage report:

```
npm run coverage
```
## Contributing

* If you're unsure if a feature would make a good addition, you can always [create an issue](https://github.com/nspragg/file-js/issues/new) first.
* We aim for 100% test coverage. Please write tests for any new functionality or changes.
* Any API changes should be fully documented.
* Make sure your code meets our linting standards. Run `npm run lint` to check your code.
* Maintain the existing coding style. There are some settings in `.jsbeautifyrc` to help.
* Be mindful of others when making suggestions and/or code reviewing.
