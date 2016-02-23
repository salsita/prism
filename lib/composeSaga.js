'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _rxjs = require('rxjs');

var _wrap = require('./wrap');

var _wrap2 = _interopRequireDefault(_wrap);

var _unwrap = require('./unwrap');

var _unwrap2 = _interopRequireDefault(_unwrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: opinionated

exports.default = function (saga, pattern) {
  return function (iterable) {
    return iterable.filter(function (_ref) {
      var action = _ref.action;
      return !!(0, _unwrap2.default)(action, pattern);
    }).flatMap(function (input) {
      var unwrapped = (0, _unwrap2.default)(input.action, pattern);

      return saga(_rxjs.Observable.of(_extends({}, input, { action: unwrapped }))).map(function (action) {
        return (0, _wrap2.default)(action, pattern, unwrapped.match);
      });
    });
  };
};