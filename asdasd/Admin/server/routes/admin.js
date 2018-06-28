'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _archiver = require('archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _config = require('../common/config');

var _config2 = _interopRequireDefault(_config);

var _Admin = require('../models/Admin');

var _Admin2 = _interopRequireDefault(_Admin);

var _adminAuth = require('../middlewares/adminAuth');

var _adminAuth2 = _interopRequireDefault(_adminAuth);

var _validation2 = require('../middlewares/validation');

var _validation3 = _interopRequireDefault(_validation2);

var _multerUpload = require('../middlewares/multerUpload');

var _multerUpload2 = _interopRequireDefault(_multerUpload);

var _checkFiles = require('../../../server/middlewares/checkFiles');

var _checkFiles2 = _interopRequireDefault(_checkFiles);

var _fotoParams = require('../../../server/models/fotoParams');

var _fotoParams2 = _interopRequireDefault(_fotoParams);

var _order = require('../../../server/models/order');

var _order2 = _interopRequireDefault(_order);

var _user = require('../../../server/models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Models = _config2.default.default.models;


var route = _express2.default.Router();

var multerStorage = _multer2.default.diskStorage({
    destination: function destination(req, file, cb) {
        _fs2.default.stat(_config2.default.default.uploads.destination, function (err, stats) {
            if (err) {
                if (err.code === 'ENOENT') {
                    try {
                        _fs2.default.mkdirSync(_config2.default.default.uploads.destination);
                        cb(null, _config2.default.default.uploads.destination);
                    } catch (err) {
                        log.error(err.message);
                        res.status(500).json({ errors: err.message });
                    }
                };
            } else {
                cb(null, _config2.default.default.uploads.destination);
            }
        });
    },
    filename: function filename(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var uploads = (0, _multer2.default)({
    storage: multerStorage,
    fileFilter: function fileFilter(req, file, cb) {
        if (file.mimetype.split('/')[0] !== 'image') {
            cb(null, false);
        } else {
            cb(null, true);
        }
    },
    limits: {
        fileSize: Math.pow(10, 7)
    }
});

route.get('/login', function (req, res) {
    return res.sendFile(_path2.default.join(__dirname, '..', 'adminPage.html'));
});

route.get('/api/download/:orderName', _adminAuth2.default, function (req, res) {
    var orderName = req.params.orderName;


    return _order2.default.findOne({ orderName: orderName }).then(function (order) {
        try {
            if (order) {
                var _ref = [order.datePath, order.orderName],
                    datePath = _ref[0],
                    _orderName = _ref[1];


                var archive = (0, _archiver2.default)('zip', {
                    zlib: { level: 9 // Sets the compression level.
                    } });

                var output = res;
                var dirPath = _path2.default.join(_config2.default.default.uploads.ordersPath, datePath, _orderName);
                archive.directory(dirPath, _orderName);
                archive.pipe(res);
                archive.finalize();
            } else {
                res.status(410).json({ error: 'Заказ удален' });
            };
        } catch (err) {
            res.status(500).json({ error: err });
        };
    });
});

route.get('/api/delete-order/:orderName', _adminAuth2.default, function (req, res) {
    var orderName = req.params.orderName;


    return _order2.default.findOne({ orderName: orderName }).then(function (order) {
        if (order) {
            return _promise2.default.all([_shelljs2.default.rm('-rf', _path2.default.join(_config2.default.default.uploads.ordersPath, order.datePath, order.orderName)), order.remove()]).then(function () {
                return res.json('order ' + orderName + ' deleted');
            });
        } else {
            res.status(410).json({ error: 'Заказ удален' });
        };
    }).catch(function (err) {
        return res.status(500).json({ error: err });
    });
});

route.get('/new/:pass', function (req, res) {
    var pass = req.params.pass;

    return new _Admin2.default({ name: pass, hashPassword: _bcryptNodejs2.default.hashSync(pass) }).save().then(function () {
        return res.json('success');
    });
});
route.get('/make-foto-params/:title', function (req, res) {
    return new _fotoParams2.default({ title: req.params.title }).save().then(function () {
        return res.json('success');
    }).catch(function (err) {
        return res.status(500).json(err.message);
    });
});

route.get('/*', _adminAuth2.default, function (req, res) {
    return res.sendFile(_path2.default.join(__dirname, '..', 'adminPage.html'));
});

route.post('/api/login', function (req, res) {
    var _validation = (0, _validation3.default)(req.body),
        isValid = _validation.isValid,
        errors = _validation.errors;

    var _req$body = req.body,
        name = _req$body.name,
        password = _req$body.password;


    if (!isValid) {
        res.status(400).json({ errors: errors });
    } else {
        return _Admin2.default.findOne({ name: name }, function (err, user) {
            if (err) {
                res.status(500).json({ errors: err.message });
            } else if (!user) {
                res.status(400).json({ errors: { name: 'No such user' } });
            } else {
                _bcryptNodejs2.default.compare(password, user.hashPassword, function (err, pas) {
                    if (err) {
                        console.log(err);
                        res.status(400).json({ errors: err.message });
                    } else if (!pas) {
                        res.status(400).json({ errors: { password: 'Password not correct' } });
                    } else {
                        try {
                            req.session.isAdmin = true;
                            req.session.save();
                            res.json('login admin');
                        } catch (err) {
                            // log.error(err);
                            // res.status(500).json({ errors: err.message })
                        }
                    }
                });
            }
        });
    }
});

route.post('/fetch-categories', function (req, res) {
    res.json({ categories: Models.map(function (item) {
            return { title: item.title, name: item.name };
        }) });
});

route.post('/get-category', function (req, res) {
    var value = req.body.value;

    if (value === 'all') {
        return _promise2.default.all(Models.filter(function (item) {
            return item.title !== 'all';
        }).map(function (item) {
            return item.model.find({});
        })).then(function (reslv) {
            var products = [];
            reslv.forEach(function (prod) {
                products.push.apply(products, (0, _toConsumableArray3.default)(prod));
            });
            res.json({ products: products });
        }).catch(function (err) {
            return console.log(err);
        });
    } else {
        var productModel = Models.find(function (item) {
            return item.title === value;
        });
        return productModel.model.find({}).then(function (products) {
            return res.json({ products: products });
        }).catch(function (err) {
            return res.status(500).json({ errors: err.message });
        });
    }
});

route.post('/edit-product', uploads.single('image'), _multerUpload2.default, function (req, res) {});

route.post('/delete-product', _multerUpload.deleteDoc, function (req, res) {});

route.post('/update-foto-params', function (req, res) {
    var _req$body2 = req.body,
        id = _req$body2.id,
        paper = _req$body2.paper,
        type = _req$body2.type,
        value = _req$body2.value;


    return _fotoParams2.default.findById(id).then(function (format) {
        var paperType = format.paperType.map(function (item) {
            if (item.title === type) {
                return (0, _extends3.default)({}, item, {
                    value: value
                });
            } else {
                return item;
            }
        });
        return _fotoParams2.default.findByIdAndUpdate(id, { $set: { paperType: paperType } }, { new: true }).then(function (result) {
            return res.json({ result: result });
        });
    }).catch(function (err) {
        return res.status(500).json({ error: err.message });
    });
});

route.post('/api/get-orders', function (req, res) {
    return _order2.default.find({}).then(function (orders) {
        return (0, _checkFiles2.default)(orders);
    }).then(function (orders) {
        return _promise2.default.all(orders.map(function (order) {
            return _user2.default.findById(order.owner).then(function (user) {
                if (user) {
                    return {
                        _id: order._id,
                        orderName: order.orderName,
                        datePath: order.datePath,
                        status: order.status,
                        contacts: order.contacts,
                        files: order.files,
                        createdAt: order.createdAt,
                        owner: {
                            username: user.username,
                            email: user.email,
                            phone: user.phone,
                            address: user.address
                        }
                    };
                } else {
                    return {
                        _id: order._id,
                        orderName: order.orderName,
                        datePath: order.datePath,
                        status: order.status,
                        contacts: order.contacts,
                        files: order.files,
                        createdAt: order.createdAt
                    };
                }
            });
        })).then(function (orders) {
            return res.json({ orders: orders });
        });
    }).catch(function (err) {
        return res.status(500).json({ error: err });
    });
});

route.post('/api/change-order-status', _adminAuth2.default, function (req, res) {
    var _req$body3 = req.body,
        orderName = _req$body3.orderName,
        status = _req$body3.status;


    return _order2.default.findOne({ orderName: orderName }).then(function (order) {
        if (order) {
            order.status = status;
            order.save().then(function (order) {
                return res.json({ order: order });
            });
        } else {
            res.status(410).json({ error: 'Заказ удален' });
        };
    }).catch(function (err) {
        return res.status(500).json({ error: err });
    });
});

route.post('/change-show', function (req, res) {
    var _req$body4 = req.body,
        _id = _req$body4._id,
        category = _req$body4.category;


    var productModel = Models.find(function (item) {
        return item.name === category;
    });
    return productModel.model.findById(_id).then(function (product) {
        product.show = !product.show;
        product.save().then(function () {
            return res.json('success updated');
        }).catch(function (err) {
            throw err;
        });
    }).catch(function (err) {
        return res.status(500).json({ error: err.message });
    });
});

exports.default = route;