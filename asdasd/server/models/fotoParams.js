'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paramsSchema = new _mongoose2.default.Schema({
    title: {
        type: String,
        unique: true
    },
    paperType: {
        type: Array,
        default: [{
            title: 'gl',
            name: 'Глянцевая',
            value: true
        }, {
            title: 'mt',
            name: 'Матовая',
            value: true
        }]
    }
});

exports.default = _mongoose2.default.model('param', paramsSchema);