'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _forIn = require('lodash/forIn');

var _forIn2 = _interopRequireDefault(_forIn);

var _log = require('../common/log');

var _log2 = _interopRequireDefault(_log);

var _clientConfig = require('../common/clientConfig');

var _clientConfig2 = _interopRequireDefault(_clientConfig);

var _emailConfig = require('../common/emailConfig');

var _emailConfig2 = _interopRequireDefault(_emailConfig);

var _config = require('../common/config');

var _config2 = _interopRequireDefault(_config);

var _validate = require('../common/validate');

var _checkUser = require('../middlewares/checkUser');

var _checkUser2 = _interopRequireDefault(_checkUser);

var _checkFiles = require('../middlewares/checkFiles');

var _checkFiles2 = _interopRequireDefault(_checkFiles);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _recoveryPass = require('../models/recoveryPass');

var _recoveryPass2 = _interopRequireDefault(_recoveryPass);

var _order = require('../models/order');

var _order2 = _interopRequireDefault(_order);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var route = _express2.default.Router();

route.post('/api/login-register', function (req, res) {
    var register = req.body.register;

    var _validateInput = (0, _validate.validateInput)((0, _extends3.default)({}, req.body), { ignore: ['register'] }),
        isValid = _validateInput.isValid,
        errors = _validateInput.errors;

    if (!isValid) {
        res.status(400).json({ error: errors });
    } else if (register) {
        var _req$body = req.body,
            username = _req$body.username,
            email = _req$body.email,
            password = _req$body.password;

        return _user2.default.findOne({ username: username }).then(function (user) {
            if (user) {
                res.status(400).json({ error: { username: 'Пользователь с таким именем уже существует' } });
            } else {
                var hashPassword = _bcryptNodejs2.default.hashSync(password);
                return new _user2.default((0, _extends3.default)({}, req.body, {
                    hashPassword: hashPassword
                })).save().then(function (user) {
                    var token = _jsonwebtoken2.default.sign({
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        address: user.address
                    }, _clientConfig2.default.secret);
                    res.json({ token: token });
                });
            }
        }).catch(function (err) {
            _log2.default.error(err.message || err);
            res.status(500).json({ error: { globalError: err.message } });
        });
    } else {
        var _req$body2 = req.body,
            loginUsername = _req$body2.loginUsername,
            loginPass = _req$body2.loginPass;


        return _user2.default.findOne({ $or: [{ username: loginUsername }, { email: loginUsername }] }).then(function (user) {
            if (!user) {
                res.status(400).json({ error: { loginUsername: 'Нет такого пользователя' } });
            } else {
                var pass = _bcryptNodejs2.default.compareSync(loginPass, user.hashPassword);
                if (pass) {
                    var token = _jsonwebtoken2.default.sign({
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        address: user.address
                    }, _clientConfig2.default.secret);
                    res.json({ token: token });
                } else {
                    res.status(400).json({ error: { loginPass: 'Не верный пароль' } });
                }
            }
        }).catch(function (err) {
            console.log(err);
            _log2.default.error(err.message || err);
            res.status(500).json({ error: { globalError: err.message } });
        });
    };
});

route.post('/check-user', function (req, res) {
    var username = req.body.username;


    return _user2.default.findOne({ username: username }).then(function (user) {
        if (user) {
            res.json(username + ' confirmed');
        } else {
            res.status(400).json({ error: 'No user' });
        }
    });
});

route.post('/api/recovery-pass', function (req, res) {
    var username = req.body.username;

    var _validateInput2 = (0, _validate.validateInput)({ username: username }),
        isValid = _validateInput2.isValid,
        errors = _validateInput2.errors;

    if (!isValid) {
        res.status(400).json({ error: errors.username });
    } else {
        return _user2.default.findOne({ username: username }).then(function (user) {
            if (!user) {
                res.status(400).json({ error: 'Нет такого пользователя' });
            } else {
                return new _recoveryPass2.default({ username: user.username }).save().then(function (recovery) {
                    var transporter = _nodemailer2.default.createTransport(_emailConfig2.default);
                    var mailOptions = {
                        from: 'Фотоателье "Подсолнух"',
                        to: user.email,
                        subject: 'Восстановление пароля',
                        html: '\n                                    <div>\u0421\u0441\u044B\u043B\u043A\u0430 \u0434\u043B\u044F \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0430\u0440\u043E\u043B\u044F:</div>\n                                    <a href="' + _config2.default.hostAddress + '/user/recovery-link?id=' + recovery._id + '">' + _config2.default.hostAddress + '/user/recovery-link?id=' + recovery._id + '</a>\n                                    <div>\u0421\u0441\u044B\u043B\u043A\u0430 \u0431\u0443\u0434\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0438 60 \u043C\u0438\u043D\u0443\u0442</div>\n                                '
                    };

                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            res.status(500).json({ error: 'Сообщение не отправлено!' });
                        } else {
                            res.json('its ok');
                        }
                    });
                });
            }
        }).catch(function (err) {
            _log2.default.error(err.message);
            res.status(500).json({ error: err.message });
        });
    }
});

route.get('/recovery-link', function (req, res) {
    var id = req.query.id;


    return _recoveryPass2.default.findById(id).then(function (recovery) {
        if (recovery) {
            res.sendFile(_path2.default.join(__dirname, '..', 'index.html'));
        } else {
            res.redirect('/login');
        }
    });
});

route.post('/update-password', function (req, res) {
    var _req$body3 = req.body,
        password = _req$body3.password,
        id = _req$body3.id;

    var _validateInput3 = (0, _validate.validateInput)({ password: password }),
        errors = _validateInput3.errors,
        isValid = _validateInput3.isValid;

    if (!isValid) {
        res.status(400).json({ error: errors.password });
    } else if (id) {
        return _recoveryPass2.default.findById(id).then(function (recovery) {
            if (recovery) {
                return _user2.default.update({ username: recovery.username }, { $set: { hashPassword: _bcryptNodejs2.default.hashSync(password) } }).then(function (user) {
                    return recovery.remove().then(function () {
                        return res.redirect('/login');
                    });
                });
            } else {
                res.status(400).json({ error: "Время вышло" });
            }
        }).catch(function (err) {
            res.status(500).json({ error: err.message });
        });
    };
});

route.post('/api/rename-user', function (req, res) {
    if (!(0, _checkUser2.default)(req.headers, req.body._id)) {
        res.redirect('/login');
        return;
    };
    var checkObj = {};
    var userObj = {};
    for (var key in req.body) {
        if (key === '_id') continue;
        if (req.body[key].require) {
            checkObj[key] = req.body[key].fixedValue;
        };
        userObj[key] = req.body[key].fixedValue;
    };

    var _validateInput4 = (0, _validate.validateInput)(checkObj),
        isValid = _validateInput4.isValid,
        errors = _validateInput4.errors;

    if (!isValid) {
        res.status(400).json({ error: errors });
    } else {
        return _user2.default.findByIdAndUpdate(req.body._id, { $set: (0, _extends3.default)({}, userObj) }, { new: true }).then(function (user) {
            var newUser = { _id: user._id };
            (0, _forIn2.default)(userObj, function (value, key) {
                newUser[key] = user[key];
            });
            res.json({ token: _jsonwebtoken2.default.sign(newUser, _clientConfig2.default.secret) });
        }).catch(function (err) {
            res.status(500).json({ globalError: err.message });
        });
    };
});

route.get('/api/fetch-orders/:_id', function (req, res) {
    var _id = req.params._id;


    if (!(0, _checkUser2.default)(req.headers, _id)) {
        res.redirect('/login');
        return;
    };

    return _order2.default.find({ owner: _id }).then(function (orders) {
        return (0, _checkFiles2.default)(orders);
    }).then(function (orders) {
        return res.json(orders.filter(function (order) {
            return !!order;
        }));
    }).catch(function (err) {
        return res.status(500).json({ error: err.message });
    });
});

route.post('/api/delete-order', function (req, res) {
    var id = req.body.id;


    return _order2.default.findOne({ orderName: id }).then(function (order) {
        if (!(0, _checkUser2.default)(req.headers, order.owner)) {
            res.redirect('/login');
        } else if (order.status === 'progress') {
            res.status(409).json({ error: 'order is in progress' });
            return;
        } else {
            _promise2.default.all([order.remove(), _shelljs2.default.rm('-rf', _config2.default.uploads.ordersPath + '/' + order.datePath + '/' + order.orderName)]).then(function () {
                return res.json('success deleted ' + id + ' order');
            }).catch(function (err) {
                throw err;
            });
        }
    }).catch(function (err) {
        res.status(500).json({ error: err.message });
    });
});

exports.default = route;