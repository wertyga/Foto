'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = searchAndDeleteExpiresOrders;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _flattenDeep = require('lodash/flattenDeep');

var _flattenDeep2 = _interopRequireDefault(_flattenDeep);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _config = require('../common/config');

var _config2 = _interopRequireDefault(_config);

var _order = require('../models/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = require('../common/log')(module);
function searchAndDeleteExpiresOrders() {
    _fs2.default.readdir(_config2.default.uploads.ordersPath, function (err, ordersDates) {
        if (err) {
            log.error(err.message);
        } else {
            return _promise2.default.all(ordersDates.map(function (date) {
                var orderNames = _fs2.default.readdirSync(_path2.default.join(_config2.default.uploads.ordersPath, date));
                return {
                    date: date,
                    orderNames: orderNames
                };
            })).then(function (orders) {
                orders = (0, _flattenDeep2.default)(orders);

                return _promise2.default.all(orders.map(function (order) {
                    return _promise2.default.all(order.orderNames.map(function (item) {
                        _order2.default.findOne({ orderName: item }).then(function (existOrder) {
                            if (!existOrder) {
                                _shelljs2.default.rm('-rf', _path2.default.join(_config2.default.uploads.ordersPath, order.date, item));
                            }
                        });
                    })).catch(function (err) {
                        throw err;
                    });
                })).catch(function (err) {
                    throw err;
                });
            }).catch(function (err) {
                log.error(err.message);
            });
        }
    });
};