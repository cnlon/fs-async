'use strict';

const fs = require('fs')
const promisifiedFs = require('./promisified-fs')


// test runner

const result = []
let finished = 0
function print () {
    const passingIcon = '✅ '
    const failingIcon = '❌ '
    let passing = 0
    let failing = 0
    for (var i = 0, l = result.length, v, message, error, progress; i < l; i++) {
        v = result[i]
        message = v[0]
        error = v[1]
        progress = ' [' + (i + 1) + '/' + l + '] '
        if (error) {
            failing++
            console.error(failingIcon + progress + message)
            if (error instanceof Error) {
                console.error(error)
            }
        } else {
            passing++
            console.log(passingIcon + progress + message)
        }
    }
    console.log('')
    console.log('  ' + passing + ' passing ' + passingIcon)
    failing && console.error('  ' + failing + ' failing ' + failingIcon)
    console.log('')

    process.exit(failing ? 1 : 0)
}
function should (message, value) {
    const raw = [message, null] // [message, error]
    result.push(raw)
    if (typeof value === 'function') {
        try {
            value(function (res) {
                raw[1] = res instanceof Error ? res : Boolean(res)
                process.nextTick(function () {
                    finished++
                    if (result.length === finished) {
                        print()
                    }
                })
            })
        } catch (err) {
            raw[1] = err
            finished++
        }
    } else {
        raw[1] = !value
        finished++
    }
}


// tests

should('`Object.getPrototypeOf(promisifiedFs) === fs`', Object.getPrototypeOf(promisifiedFs) === fs)
should('`promisifiedFs.fs === fs`', promisifiedFs.fs === fs)
should('`promisifiedFs.constants === fs.constants`', promisifiedFs.constants === fs.constants)
should('`promisifiedFs.readFileSync === fs.readFileSync`', promisifiedFs.readFileSync === fs.readFileSync)
should('`promisifiedFs.readFile !== fs.readFile`', promisifiedFs.readFile !== fs.readFile)
const testFilename = 'test.txt'
const testContent = 'My name is promisifiedFs!'
should(
    'Write "' + testContent + '" to "' + testFilename + '" by `promisifiedFs.writeFile`.',
    function (done) {
        promisifiedFs.writeFile(testFilename, testContent)
            .then(function () {
                done()
            })
            .catch(done)
    }
)
should(
    'Read "' + testFilename + '" by `promisifiedFs.readFile`. And content should be "' + testContent + '".',
    function (done) {
        promisifiedFs.readFile(testFilename)
            .then(function (content) {
                const isError = String(content) !== testContent
                done(isError)
            })
            .catch(done)
    }
)
should(
    'Delete "' + testFilename + '" by `promisifiedFs.unlink`.',
    function (done) {
        promisifiedFs.unlink(testFilename)
            .then(function () {
                done()
            })
            .catch(done)
    }
)
should(
    'Access "' + testFilename + '" should be error by `promisifiedFs.access`.',
    function (done) {
        promisifiedFs.unlink(testFilename)
            .then(function () {
                done(true)
            })
            .catch(function () {
                done()
            })
    }
)
