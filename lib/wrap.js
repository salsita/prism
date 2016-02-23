"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (action, pattern, match) {
  var type = Object.keys(match).reduce(function (memo, chunk) {
    return pattern.replace("[" + chunk + "]", match[chunk]);
  }, pattern) + ("." + action.type);

  return _extends({}, action, {
    type: type
  });
};