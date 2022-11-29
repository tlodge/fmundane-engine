"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluate = void 0;

var evaluate = function evaluate(operator, operand, value) {
  console.log("evaluating variable!!", operator, operand, value);

  if (operator === "equals") {
    if (operand && value) {
      return operand.trim().toLowerCase() == value.trim().toLowerCase();
    }
  }

  return false;
};

exports.evaluate = evaluate;