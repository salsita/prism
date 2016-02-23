'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parsePattern = require('./parsePattern');

var _parsePattern2 = _interopRequireDefault(_parsePattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (action, pattern) {
  return !!action.type.match((0, _parsePattern2.default)(pattern).regExp);
};