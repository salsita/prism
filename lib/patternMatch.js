'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _unwrap = require('./unwrap');

var _unwrap2 = _interopRequireDefault(_unwrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (initialModel) {
  var updaters = [];

  var reducer = function reducer() {
    var model = arguments.length <= 0 || arguments[0] === undefined ? initialModel : arguments[0];
    var action = arguments[1];

    if (action) {
      return updaters.reduce(function (partialModel, _ref) {
        var updater = _ref.updater;
        var pattern = _ref.pattern;

        var unwrappedAction = (0, _unwrap2.default)(action, pattern);

        if (unwrappedAction) {
          return updater(partialModel, unwrappedAction);
        } else {
          return partialModel;
        }
      }, model);
    } else {
      return model;
    }
  };

  reducer.case = function (pattern, updater) {
    updaters.push({
      pattern: pattern,
      updater: updater
    });

    return reducer;
  };

  return reducer;
};