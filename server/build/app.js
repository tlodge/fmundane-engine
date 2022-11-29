"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _morgan = _interopRequireDefault(require("morgan"));

var _express = _interopRequireDefault(require("express"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _expressFileupload = _interopRequireDefault(require("express-fileupload"));

var _path = _interopRequireDefault(require("path"));

var _index = _interopRequireDefault(require("./routes/index"));

var _author = _interopRequireDefault(require("./routes/author"));

var _placeholder = _interopRequireDefault(require("./routes/placeholder"));

var _child_process = require("child_process");

var _fs = _interopRequireDefault(require("fs"));

var app = (0, _express["default"])();
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _cookieParser["default"])());
app.use('/event', _index["default"]);
app.use('/author', _author["default"]);
app.use('/placeholders', _placeholder["default"]);
app.use(_express["default"]["static"](_path["default"].join(__dirname, 'client')));
app.use(_express["default"]["static"](_path["default"].join(__dirname, 'author')));
app.use('/twine', _express["default"]["static"](_path["default"].join(__dirname, 'twine')));
app.use('/wa', _express["default"]["static"](_path["default"].join(__dirname, '..', 'webapps')));
app.use('/assets', _express["default"]["static"](_path["default"].join(__dirname, '..', '..', 'media')));
console.log(_path["default"].join(__dirname, '..', '..', 'placeholders'));
console.log("dirname is", __dirname);
app.use((0, _expressFileupload["default"])({
  createParentPath: true,
  limits: {
    fileSize: 1000 * 1024 * 1024 * 1024 //1000MB max file(s) size

  }
}));
app.get("/shutdown", function (req, res) {
  console.log("shutting down server!");
  (0, _child_process.execFile)("shutdown", ["-h", "now"], function (error) {
    console.log(error);
  });
});
app.get("/reboot", function (req, res) {
  console.log("rebooting server!");
  (0, _child_process.execFile)("reboot");
});
app.get('/', function (req, res) {
  res.sendFile(_path["default"].join(__dirname, 'client', 'index.html'));
});
app.get("/author", function (req, res) {
  res.sendFile(_path["default"].join(__dirname, 'author', 'index.html'));
});
app.post('/media/upload', function (req, res) {
  console.log(req.files);
  var mfile = req.files.mediaFile;
  mfile.mv("../media/".concat(mfile.name));
  res.status(200).json({
    success: true
  });
});
app.get('/media/list', function (req, res) {
  var files = _fs["default"].readdirSync("../media");

  var eligible = files.filter(function (f) {
    return f.endsWith(".mp4") || f.endsWith(".mp3") || f.endsWith("wav");
  });
  res.status(200).json({
    files: eligible
  });
});
console.log("dirname is ", __dirname);
var _default = app;
exports["default"] = _default;