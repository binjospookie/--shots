"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (ruleName, messages) {
  return Object.keys(messages).reduce(function (newMessages, messageId) {
    var messageText = messages[messageId];
    newMessages[messageId] = typeof messageText === "string" ? messageText + " (" + ruleName + ")" : function () {
      return messageText.apply(undefined, arguments) + " (" + ruleName + ")";
    };
    return newMessages;
  }, {});
};