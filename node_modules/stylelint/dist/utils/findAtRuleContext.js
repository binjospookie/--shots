"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findAtRuleContext;
/**
 * Find the at-rule in which a rule is nested.
 *
 * Returns `null` if the rule is not nested within an at-rule.
 *
 * @param {Rule} rule
 * @return {AtRule|null}
 */
function findAtRuleContext(rule) {
  var parent = rule.parent;

  if (parent.type === "root") {
    return null;
  }
  if (parent.type === "atrule") {
    return parent;
  }
  return findAtRuleContext(parent);
}