'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = function (req, res, next) {
    var productId = req.body.productId;

    var imagePath = '' + (req.file ? req.file.filename : req.body.image);

    if (!productId) {
        saveNewProduct((0, _extends3.default)({}, req.body, { imagePath: imagePath }), res);
    } else {
        editProduct((0, _extends3.default)({}, req.body, { imagePath: imagePath }), res);
    }
};

exports.deleteDoc = deleteDoc;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('../common/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Models = _config2.default.default.models;
//Models must be { title: 'some title', name: 'some name', model: model-mongoose } - Array

;

function saveNewProduct(opt, res) {
    var model = Models.find(function (item) {
        return item.name === opt.category;
    });

    new model.model((0, _extends3.default)({}, opt)).save(function (err, product) {
        if (err) {
            res.status(500).json({ errors: err.message });
        } else {
            res.json({ product: product });
        }
    });
};

function editProduct(opt, res) {
    var Model = Models.find(function (item) {
        return item.title === opt.oldCategory;
    });

    Model.model.findById(opt.productId, function (err, product) {
        if (err) {
            res.status(500).json({ errors: err.message });
        } else if (opt.category !== product.category) {
            saveNewProduct(opt, res);
            if (product.filePath !== opt.filePath) deleteImage(product);
            deleteProduct(product);
        } else {
            Model.model.findByIdAndUpdate(opt.productId, (0, _extends3.default)({}, opt), { new: true }, function (err, result) {
                if (err) {
                    res.status(500).json({ errors: err.message });
                } else {
                    if (product.filePath !== opt.filePath) deleteImage(product);
                    res.json({ product: result });
                }
            });
        }
    });
};

function deleteProduct(product) {
    try {
        product.remove();
    } catch (err) {
        log.error(err.message);
    }
};
function deleteImage(product) {
    if (!product.filePath) return;
    _fs2.default.unlink(_path2.default.join(_config2.default.uploads.destination, product.filePath), function (err) {
        if (err) {
            log.error(err.message);
            return;
        }
    });
};

function deleteDoc(req, res, next) {
    var _req$body$data = req.body.data,
        id = _req$body$data.id,
        category = _req$body$data.category;


    var Model = Models.find(function (item) {
        return item.title === category;
    });
    Model.model.findById(id, function (err, result) {
        if (err) {
            log.error(err.message);
            res.status(500).json({ errors: err.message });
        } else {
            deleteImage(result);
            deleteProduct(result);
            res.end();
        }
    });
};