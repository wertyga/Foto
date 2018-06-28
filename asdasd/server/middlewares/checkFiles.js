'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (orders) {
    if (orders.length < 1) {
        return [];
    } else {
        return _promise2.default.all(orders.map(function (order) {
            var files = order.files.map(function (file) {
                var fullFilePath = _path2.default.join(_config2.default.uploads.ordersPath, file.filePath);
                try {
                    _fs2.default.statSync(fullFilePath);
                    return file;
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        return false;
                    } else {
                        throw err;
                    }
                };
            }).filter(function (newFiles) {
                return !!newFiles;
            });

            if (files.length !== order.files.length) {
                if (files.length < 1) {
                    order.remove();
                    _shelljs2.default.rm('-rf', _path2.default.join(_config2.default.uploads.ordersPath, order.datePath, order.orderName));
                } else {
                    order.files = files;
                    return order.save();
                }
            } else {
                return order;
            };
        }));
    }
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../common/config');

var _config2 = _interopRequireDefault(_config);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }