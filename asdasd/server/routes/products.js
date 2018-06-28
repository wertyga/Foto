'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _flatten = require('lodash/flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _config = require('../common/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Models = _config2.default.models;

var Router = _express2.default.Router();

Router.get('/:title', function (req, res) {
    var title = req.params.title;

    if (title === 'all') {
        _promise2.default.all(Models.slice(1).map(function (item) {
            return item.model.find({ show: true });
        })).then(function (resolve) {
            return res.json((0, _flatten2.default)(resolve));
        }).catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
    } else {
        Models.find(function (item) {
            return item.title === title;
        }).model.find({ show: true }).then(function (products) {
            return res.json(products);
        }).catch(function (err) {
            return res.status(500).json({ error: err.message });
        });
    };
});

var i = 0;

Router.get('/save-new/:title', function (req, res) {
    var title = req.params.title;


    var random = Math.round(Math.random());

    var model = Models.find(function (item) {
        return item.title === title;
    });
    new model.model({
        title: 'Some ' + title + ' - ' + i++,
        description: 'Some long long long description',
        price: !random ? 0 : (Math.random() * 100).toFixed(2),
        discount: !random ? 0 : Math.round(Math.random() * 100),
        category: model.name,
        imagePath: !random ? '' : '13.jpg'
    }).save().then(res.json('success')).catch(function (err) {
        console.log(err);res.json('error', err.message);
    });
});

exports.default = Router;