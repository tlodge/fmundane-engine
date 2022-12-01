"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var indexRouter = _express["default"].Router();

indexRouter.get('/', function (req, res) {
  res.sendFile(_path["default"].join(__dirname, '..', '..', '..', 'placeholders', 'placeholders.json'));
});
indexRouter.get('/set', function (req, res) {
  var fname = _path["default"].join(__dirname, '..', '..', '..', 'placeholders', 'placeholders.json');

  var data = _fs["default"].readFileSync(fname);

  var placeholders = JSON.parse(data);
  var _req$query = req.query,
      key = _req$query.key,
      value = _req$query.value;

  if (key && value) {
    placeholders[key] = value;
    var wdata = JSON.stringify(placeholders, null, 4);

    _fs["default"].writeFileSync(fname, wdata);
  }

  res.status(200).json(placeholders);
});
var _default = indexRouter;
exports["default"] = _default;