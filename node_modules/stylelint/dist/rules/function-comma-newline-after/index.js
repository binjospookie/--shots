"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;

exports.default = function (expectation) {
  var checker = (0, _utils.whitespaceChecker)("newline", expectation, messages);
  return function (root, result) {
    var validOptions = (0, _utils.validateOptions)(result, ruleName, {
      actual: expectation,
      possible: ["always", "always-multi-line", "never-multi-line"]
    });
    if (!validOptions) {
      return;
    }

    (0, _functionCommaSpaceAfter.functionCommaSpaceChecker)({
      root: root,
      result: result,
      locationChecker: checker.afterOneOnly,
      checkedRuleName: ruleName
    });
  };
};

var _utils = require("../../utils");

var _functionCommaSpaceAfter = require("../function-comma-space-after");

var ruleName = exports.ruleName = "function-comma-newline-after";

var messages = exports.messages = (0, _utils.ruleMessages)(ruleName, {
  expectedAfter: function expectedAfter() {
    return "Expected newline after \",\"";
  },
  expectedAfterMultiLine: function expectedAfterMultiLine() {
    return "Expected newline after \",\" in a multi-line function";
  },
  rejectedAfterMultiLine: function rejectedAfterMultiLine() {
    return "Unexpected whitespace after \",\" in a multi-line function";
  }
});