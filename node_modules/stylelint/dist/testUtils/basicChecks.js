"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// These should pass for *almost* every rule
exports.default = [{
  code: "",
  description: "empty stylesheet"
}, {
  code: "a {}",
  description: "empty rule"
}, {
  code: "@import \"foo.css\";",
  description: "blockless statement"
}, {
  code: ":global {}",
  description: "CSS Modules global empty rule set"
}];