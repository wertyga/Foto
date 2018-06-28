'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var secret = 'somesecretfortoken';
var maxFileSize = 50000000;

exports.default = {
    secret: secret,
    maxFileSize: maxFileSize,
    localStorageProperty: 'fpsx'
};