"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, objs = Array(_len), _key = 0; _key < _len; _key++) {
    objs[_key] = arguments[_key];
  }

  return _lodash2.default.mergeWith.apply(_lodash2.default, [{}].concat(objs, [mergeCustomizer]));
};

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeCustomizer(objValue, srcValue) {
  if (_lodash2.default.isArray(objValue, mergeCustomizer)) {
    return objValue.concat(srcValue);
  }
}