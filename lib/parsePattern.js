'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ALPHANUMERICAL_GROUP_REGEXP_STRING = '([a-zA-Z0-9\-]*)';

exports.default = function (pattern) {
  var patterns = pattern.split('.').map(function (chunk) {
    var match = chunk.match(/\[([a-zA-Z0-9\-]*)\]/);

    if (match) {
      return {
        dynamic: true,
        name: match[1]
      };
    } else {
      return {
        dynamic: false,
        name: chunk
      };
    }
  });

  var regExp = patterns.reduce(function (memo, chunk, index) {
    var isLast = index === patterns.length - 1;

    if (chunk.dynamic) {
      return memo + ALPHANUMERICAL_GROUP_REGEXP_STRING + ('\\.' + (isLast ? '?' : ''));
    } else {
      return memo + chunk.name + ('\\.' + (isLast ? '?' : ''));
    }
  }, '') + '(.*)';

  return {
    patterns: patterns,
    regExp: new RegExp(regExp)
  };
};