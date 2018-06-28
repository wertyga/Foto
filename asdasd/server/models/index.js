'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _products = require('../data/products');

var _products2 = _interopRequireDefault(_products);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductModel = function ProductModel() {
    return new _mongoose2.default.Schema({
        title: String,
        description: String,
        category: String,
        price: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        show: {
            type: Boolean,
            default: true
        },
        imagePath: {
            type: String,
            default: ''
        }
    });
};

exports.default = [{ name: 'Все', title: 'all' }].concat(_products2.default.map(function (item) {
    return (0, _extends3.default)({}, item, { model: _mongoose2.default.model(item.title, new ProductModel()) });
}));