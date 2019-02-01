# file-js

[![NPM downloads](https://img.shields.io/npm/dm/file-js.svg?style=flat)](https://npmjs.org/package/file-js)
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

## Demo

<img src="https://cloud.githubusercontent.com/assets/5588391/23019443/50b62ff8-f43a-11e6-9f1a-1fc7ce079fcc.gif" width="600">

## Features

* File glob matching
* File listings
* Assert file permissions
* Supports promises
* Supports synchronous and asynchronous methods

## Usage

```js
const File = require('file-js');

const file = File.create('myDir');
const files = await file.getList();
files.forEach(console.log);

const file = File.create('myDirectory');
if (file.isDirectorySync()) {
  console.log('processing directory');
}
```

## Documentation
For more examples and API details, see [API documentation](https://nspragg.github.io/file-js/)

## Test

```
npm test
```

To generate a test coverage report:

```
npm run coverage
```
