'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var recoveryPass = _mongoose2.default.Schema({
    username: String,
    createdAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 3600 }
    }
});

exports.default = _mongoose2.default.model('recovery', recoveryPass);