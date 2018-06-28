'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

;