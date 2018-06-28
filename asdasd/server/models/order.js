'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _orderStatus = require('../data/orderStatus');

var _orderStatus2 = _interopRequireDefault(_orderStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var orderModel = new _mongoose2.default.Schema({
    orderName: String,
    datePath: String,
    status: {
        type: String,
        default: _orderStatus2.default[0]
    },
    owner: {
        type: _mongoose2.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    contacts: String,
    files: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 3600 * 24 * 30 }
    }
});

//Ready status: 'await', 'progress', 'done'
exports.default = _mongoose2.default.model('order', orderModel);