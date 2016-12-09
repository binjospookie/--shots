"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;

exports.default = function (expectation) {
  var checker = (0, _utils.whitespaceChecker)("space", expectation, messages);
  return function (root, result) {
    var validOptions = (0, _utils.validateOptions)(result, ruleName, {
      actual: expectation,
      possible: ["always", "never", "always-single-line", "never-single-line"]
    });
    if (!validOptions) {
      return;
    }

    (0, _functionCommaSpaceAfter.functionCommaSpaceChecker)({
      root: root,
      result: result,
      locationChecker: checker.before,
      checkedRuleName: ruleName
    });
  };
};

var _utils = require("../../utils");

var _functionCommaSpaceAfter = require("../function-comma-space-after");

var ruleName = exports.ruleName = "function-comma-space-before";

var messages = exports.messages = (0, _utils.ruleMessages)(ruleName, {
  expectedBefore: function expectedBefore() {
    return "Expected single space before \",\"";
  },
  rejectedBefore: function rejectedBefore() {
    return "Unexpected whitespace before \",\"";
  },
  expectedBeforeSingleLine: function expectedBeforeSingleLine() {
    return "Expected single space before \",\" in a single-line function";
  },
  rejectedBeforeSingleLine: function rejectedBeforeSingleLine() {
    return "Unexpected whitespace before \",\" in a single-line function";
  }
});