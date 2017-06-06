'use strict';

const fs = require('fs')


const slice = Array.prototype.slice
function proxy (key) {
    const method = fs[key]
    return function promisifiedFsMethod () {
        const args = slice.call(arguments)
        return new Promise(function (resolve, reject) {
            args.push(function promisifiedFsCallback () {
                const callbackArgs = slice.call(arguments)
                if (callbackArgs[0]) { // error
                    reject.apply(null, callbackArgs)
                } else {
                    resolve(callbackArgs.slice(1))
                }
            })
            method.apply(null, args)
        })
    }
}

const promisifiedFs = Object.create(fs)
Object.defineProperty(promisifiedFs, 'fs', {value: fs})
const keys = Object.keys(fs)
for (var i = 0, l = keys.length, key; i < l; i++) {
    key = keys[i]
    if (fs.hasOwnProperty(key + 'Sync')) {
        promisifiedFs[key] = proxy(key)
    }
}


module.exports = promisifiedFs
