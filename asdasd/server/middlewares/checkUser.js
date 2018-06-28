'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = checkUserSession;

var _jwtDecode = require('jwt-decode');

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkUserSession(header, userId) {
    var authHeader = header['authorization'].split('Bearer')[1].trim();
    return String((0, _jwtDecode2.default)(authHeader)._id) === String(userId);
};