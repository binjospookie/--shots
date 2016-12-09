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
      if (decl.prop.indexOf("//") === 0) {
        (0, _utils.report)({
          message: messages.rejected,
          node: decl,
          result: result,
          ruleName: ruleName
        });
      }
    });
    root.walkRules(function (rule) {
      rule.selectors.forEach(function (selector) {
        if (selector.indexOf("//") === 0) {
          (0, _utils.report)({
            message: messages.rejected,
            node: rule,
            result: result,
            ruleName: ruleName
          });
        }
      });
    });
  };
};

var _utils = require("../../utils");

var ruleName = exports.ruleName = "no-invalid-double-slash-comments";

var messages = exports.messages = (0, _utils.ruleMessages)(ruleName, {
  rejected: "Unexpected double-slash CSS comment"
});