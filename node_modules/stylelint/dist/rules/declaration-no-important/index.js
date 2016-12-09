"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;

exports.default = function (actual) {
  return function (root, result) {
    var validOptions = (0, _utils.validateOptions)(result, ruleName, { actual: actual });
    if (!validOptions) {
      return;
    }

    root.walkDecls(function (decl) {
      if (!decl.important) {
        return;
      }

      (0, _utils.report)({
        message: messages.rejected,
        node: decl,
        word: "important",
        result: result,
        ruleName: ruleName
      });
    });
  };
};

var _utils = require("../../utils");

var ruleName = exports.ruleName = "declaration-no-important";

var messages = exports.messages = (0, _utils.ruleMessages)(ruleName, {
  rejected: "Unexpected !important"
});