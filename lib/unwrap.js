'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _parsePattern = require('./parsePattern');

var _parsePattern2 = _interopRequireDefault(_parsePattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var last = function last(arr) {
  return arr[arr.length - 1];
};

exports.default = function (action, pattern) {
  var parsedPattern = (0, _parsePattern2.default)(pattern);

  var regExpMatch = action.type.match(parsedPattern.regExp);
  if (regExpMatch) {
    regExpMatch.shift();
    var type = last(regExpMatch);

    var match = parsedPattern.patterns.filter(function (current) {
      return current.dynamic;
    }).reduce(function (memo, current, index) {
      return _extends({}, memo, _defineProperty({}, current.name, regExpMatch[index]));
    }, {});

    return _extends({}, action, {
      type: type,
      match: match
    });
  } else {
    return false;
  }
};