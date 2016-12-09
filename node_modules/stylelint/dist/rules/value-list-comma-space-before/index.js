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

    (0, _valueListCommaSpaceAfter.valueListCommaWhitespaceChecker)({
      root: root,
      result: result,
      locationChecker: checker.before,
      checkedRuleName: ruleName
    });
  };
};

var _utils = require("../../utils");

var _valueListCommaSpaceAfter = require("../value-list-comma-space-after");

var ruleName = exports.ruleName = "value-list-comma-space-before";

var messages = exports.messages = (0, _utils.ruleMessages)(ruleName, {
  expectedBefore: function expectedBefore() {
    return "Expected single space before \",\"";
  },
  rejectedBefore: function rejectedBefore() {
    return "Unexpected whitespace before \",\"";
  },
  expectedBeforeSingleLine: function expectedBeforeSingleLine() {
    return "Unexpected whitespace before \",\" in a single-line list";
  },
  rejectedBeforeSingleLine: function rejectedBeforeSingleLine() {
    return "Unexpected whitespace before \",\" in a single-line list";
  }
});