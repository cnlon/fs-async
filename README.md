# promisified-fs

[![node version](https://img.shields.io/badge/node-%3E%3Dv0.12-brightgreen.svg)](https://travis-ci.org/cnlon/promisified-fs)
[![npm version](https://img.shields.io/npm/v/promisified-fs.svg?colorB=brightgreen)](https://www.npmjs.com/package/promisified-fs)
[![build status](https://img.shields.io/travis/cnlon/promisified-fs/master.svg)](https://travis-ci.org/cnlon/promisified-fs)
[![code style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

A promisified version of `fs`.

<hr>

Many `fs` methods are converted into promises.
Any properties that aren't asynchronous will simply be proxied.

## Installation & Usage

```bash
npm install promisified-fs
```

```javascript
const fs = require('promisified-fs')

fs.access('filename.txt', fs.constants.W_OK)
    .then(function () {
        console.log('Can write!')
    })
    .catch(function (error) {
        console.log('No access!')
    })
```

With ES2017 `async/await`:

```javascript
const fs = require('promisified-fs')

async function doSomething () {
    const data = await fs.readFile('filename.txt')
    // do something
}
```

## License

[MIT](https://github.com/cnlon/promisified-fs/blob/master/LICENSE)
