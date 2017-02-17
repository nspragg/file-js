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

## Demo

<img src="https://cloud.githubusercontent.com/assets/5588391/23019443/50b62ff8-f43a-11e6-9f1a-1fc7ce079fcc.gif" width="600">

## Features

* File glob matching
* File listings
* File locking
* Assert file permissions
* Supports promises
* Supports synchronous and asynchronous methods

## Coming soon

* File matching with regular expressions
* Create temp files
* Create directories via `.mkdir` and `.mkdirp`
* Assert existence of files via `.exists()`
* Watch file
* Change permissions
* Support file URI
* Support for callbacks

## Usage

```js
const File = require('file-js');

const file = File.create('myDir');
file.getList()
  then((files) => {
    files.each(console.log);
  });

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
## Contributing

* If you're unsure if a feature would make a good addition, you can always [create an issue](https://github.com/nspragg/file-js/issues/new) first.
* We aim for 100% test coverage. Please write tests for any new functionality or changes.
* Any API changes should be fully documented.
* Make sure your code meets our linting standards. Run `npm run lint` to check your code.
* Maintain the existing coding style. There are some settings in `.jsbeautifyrc` to help.
* Be mindful of others when making suggestions and/or code reviewing.
