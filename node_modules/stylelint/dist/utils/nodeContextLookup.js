"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var contextMap = new Map();

  return {
    getContext: function getContext(node) {
      var nodeSource = node.source.input.from;
      var baseContext = creativeGetMap(contextMap, nodeSource);

      for (var _len = arguments.length, subContexts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        subContexts[_key - 1] = arguments[_key];
      }

      return subContexts.reduce(function (result, context) {
        return creativeGetMap(result, context);
      }, baseContext);
    }
  };
};

function creativeGetMap(someMap, someThing) {
  if (!someMap.has(someThing)) {
    someMap.set(someThing, new Map());
  }
  return someMap.get(someThing);
} /**
   * Create a collection of Maps that serve to contextualize a given node.
   * This is useful to ensure that you only compare nodes that share a certain
   * context.
   *
   * All nodes are initially contextualized by their input source.
   * From there, you can contextualize them however you want.
   *
   * For a usage example, see `selector-no-descending-specificity`.
   */