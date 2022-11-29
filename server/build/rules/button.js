"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluate = void 0;

var evaluate = function evaluate(operator, operand, value) {
  if (operator === "equals") {
    return operand.toLowerCase().trim() === value.toLowerCase().trim();
  }

  return false;
};

exports.evaluate = evaluate;