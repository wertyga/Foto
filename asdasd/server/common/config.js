'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    PORT: 3000,
    mongoose: {
        uri: 'mongodb://localhost/',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    },
    pg: {
        user: 'wertyga',
        pass: 'wertygan'
    },
    dbName: 'fotoPodsolnux',
    session: {
        secret: "nodeJSForever",
        key: "sid",
        cookie: {
            httpOnly: true,
            maxAge: 3600000
        }
    },
    hash: {
        secret: 'boooom!',
        salt: 10
    },
    uploads: {
        directory: 'productsImages',
        destination: _path2.default.join(__dirname, '../', 'productsImages'),
        maxFileSize: 50000000,
        ordersPath: _path2.default.join(__dirname, '../', '../', 'orders')
    },
    logFilePath: _path2.default.join(__dirname, '../', 'node.log'),
    models: _index2.default,
    hostAddress: 'http://localhost:3000'
};