'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../common/config');

var _config2 = _interopRequireDefault(_config);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLogger(module) {
    var pathName = module.filename.split('/').slice(-2).join('/');
    var logFile = _config2.default.logFilePath;

    return {
        error: function error(msg) {
            var errorMsg = 'Type: ERROR; Time: ' + new Date() + '; File: ' + pathName + '; Message: ' + msg + '\n\n';
            _fs2.default.appendFileSync(logFile, errorMsg);
        },
        info: function info(msg) {
            var errorMsg = 'Type: INFO; Time: ' + new Date() + '; File: ' + pathName + '; Message: ' + msg + '\n\n';
            _fs2.default.appendFileSync(logFile, errorMsg);
        }
    };
}

module.exports = getLogger;