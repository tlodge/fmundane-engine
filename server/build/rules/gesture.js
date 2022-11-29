"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluate = void 0;

var evaluate = function evaluate(operator, operand, value) {
  if (operator === "equals") {
    return operand.map(function (o) {
      return o.toLowerCase().trim();
    }).indexOf(value.toLowerCase().trim()) != -1;
  }

  return false;
};

exports.evaluate = evaluate;