'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = _mongoose2.default.Schema({
    username: {
        type: String,
        unique: true
    },
    email: String,
    phone: String,
    address: String,
    hashPassword: String
});

exports.default = _mongoose2.default.model('user', userSchema);