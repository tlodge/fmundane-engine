"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var indexRouter = _express["default"].Router();

indexRouter.get('/', function (req, res) {
  res.sendFile(_path["default"].join(__dirname, '..', '..', '..', 'placeholders', 'placeholders.json'));
});
indexRouter.post('/set', function (req, res) {
  res.status(200).json({
    sucess: true
  });
});
var _default = indexRouter;
exports["default"] = _default;