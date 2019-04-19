"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
/**
 * Simple promise wrapper around node's readFile
 */
exports.readFile = function (file) {
    return new Promise(function (resolve, reject) {
        fs_1.readFile(file, 'utf8', function (err, contents) {
            err
                ? reject(err)
                : resolve(contents);
        });
    });
};
/**
 * Simple promise wrapper around node's writeFile
 */
exports.writeFile = function (file, content) {
    return new Promise(function (resolve, reject) {
        fs_1.writeFile(file, content, function (err) {
            err
                ? reject(err)
                : resolve();
        });
    });
};
