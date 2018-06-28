'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multiparty = require('multiparty');

var _multiparty2 = _interopRequireDefault(_multiparty);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _emailConfig = require('../common/emailConfig');

var _emailConfig2 = _interopRequireDefault(_emailConfig);

var _jwtDecode2 = require('jwt-decode');

var _jwtDecode3 = _interopRequireDefault(_jwtDecode2);

var _config = require('../common/config');

var _config2 = _interopRequireDefault(_config);

var _order = require('../models/order');

var _order2 = _interopRequireDefault(_order);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = require('../common/log')(module);

var Router = _express2.default.Router();

var needPath = function needPath(orderName, jwtString) {
    var description = (0, _jwtDecode3.default)(jwtString);
    var format = description.format;
    var amount = description.amount;
    var paper = description.paper;
    var date = new Date();
    var ordersPath = _config2.default.uploads.ordersPath;
    var datePart = date.getDate() + '-' + (date.getMonth() + 1);
    var formatsAmountPath = _path2.default.join(format + '-' + paper, String(amount));

    return {
        datePath: datePart,
        formatsAmountPath: formatsAmountPath,
        fullDirectoryPath: _path2.default.join(ordersPath, datePart, orderName, formatsAmountPath),
        fileId: description.id
    };
};

var sendEmailByOrder = function sendEmailByOrder(orderName) {
    var transporter = _nodemailer2.default.createTransport(_emailConfig2.default);
    var mailOptions = {
        from: 'Foto_Podsolnux',
        to: 'fotopodsolnux@gmail.com',
        subject: 'new Order - ' + (orderName || 'No order'),
        html: '<div>Message: New order - ' + orderName + '</div>'
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            log.error(err.message);
            console.error('Email not sent: ' + err);
        };
    });
};

Router.post('/users-fotos/:order', function (req, res) {
    var _jwtDecode = (0, _jwtDecode3.default)(req.params.order),
        user = _jwtDecode.user,
        contacts = _jwtDecode.contacts,
        orderName = _jwtDecode.orderName;

    var commonDatePath = void 0;

    if (!orderName || !user && !contacts) {
        res.status(400).json({ error: { contactsError: 'Что то не так с данными' } });
        return;
    };
    req.order = [];
    var form = new _multiparty2.default.Form({
        maxFilesSize: _config2.default.uploads.maxFileSize
    });

    form.on('part', function (part) {
        var _needPath = needPath(orderName, part.name),
            datePath = _needPath.datePath,
            fullDirectoryPath = _needPath.fullDirectoryPath,
            fileId = _needPath.fileId,
            formatsAmountPath = _needPath.formatsAmountPath;

        commonDatePath = datePath;
        var decodePart = (0, _jwtDecode3.default)(part.name);

        try {
            _fs2.default.statSync(fullDirectoryPath);
        } catch (err) {
            if (err.code === 'ENOENT') {
                _shelljs2.default.mkdir('-p', fullDirectoryPath);
            } else {
                res.status(500).json({ error: err.message });
                log.error(err.message);
                return;
            }
        };

        var fileName = fileId + '-' + (part.filename || decodePart.fileName);
        var ws = _fs2.default.createWriteStream(_path2.default.join(fullDirectoryPath, fileName));
        ws.on('error', function (err) {
            log.error(err);
            form.emit('error', { message: { globalError: err } });
        });

        if (part.filename) {
            part.pipe(ws);
        } else {
            var fullFilePath = _path2.default.join(_config2.default.uploads.ordersPath, decodePart.filePath);

            var rs = _fs2.default.createReadStream(fullFilePath);
            rs.pipe(ws);
            rs.on('error', function () {
                var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(err) {
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    log.error(err);
                                    part.resume();

                                case 2:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, undefined);
                }));

                return function (_x) {
                    return _ref.apply(this, arguments);
                };
            }());
        };

        req.order.push((0, _extends3.default)({}, decodePart, {
            filePath: _path2.default.join('/', datePath, orderName, formatsAmountPath, fileName),
            datePath: datePath,
            fileName: fileName
        }));
    });

    form.on('finish', function () {
        if (req.order.length < 1) {
            res.status(400).json({ error: 'Ошибка' });
            return;
        }
        return _user2.default.findOne({ username: user }).then(function (user) {
            var orderObj = {
                contacts: contacts,
                orderName: String(orderName),
                datePath: req.order[0].datePath,
                files: req.order
            };
            if (user) orderObj.owner = user._id;

            return new _order2.default(orderObj).save().then(function () {
                res.json('success');
                sendEmailByOrder(String(orderName));
            });
        }).catch(function (err) {
            res.status(400).json({ error: { globalError: err.message } });
            log.error(err.message);
        });
    });
    form.on('error', function (err) {
        res.status(500).json({ error: err.message });
        log.error(err);
    });

    form.parse(req);
});

exports.default = Router;