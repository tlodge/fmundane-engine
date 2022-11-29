"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireWildcard(require("fs"));

var _actionhandler = require("../actionhandler");

var _actions2 = _interopRequireDefault(require("../actions/actions.json"));

var _IPs = _interopRequireDefault(require("../actions/IPs.json"));

var _utils = require("../utils");

var _superagent = _interopRequireDefault(require("superagent"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var actions = JSON.parse(Object.keys(_IPs["default"]).reduce(function (acc, key) {
  return (0, _utils.replaceAll)(acc, "[".concat(key, "]"), _IPs["default"][key]);
}, JSON.stringify(_actions2["default"])));

var authorRouter = _express["default"].Router();

authorRouter.post('/save', function (req, res) {
  var _req$body = req.body,
      layer = _req$body.layer,
      name = _req$body.name;

  _fs["default"].writeFileSync("authored/".concat(name, ".json"), JSON.stringify(layer, null, 4));

  res.status(200).json({});
});
authorRouter.post('/audiotest', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var lines;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            lines = req.body.lines;
            _context.next = 3;
            return (0, _actionhandler.handlespeech)(lines);

          case 3:
            res.status(200).json({});

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
authorRouter.post('/actiontest', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _actions, _iterator, _step, a;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _actions = req.body.actions;
            _iterator = _createForOfIteratorHelper(_actions);
            _context2.prev = 2;

            _iterator.s();

          case 4:
            if ((_step = _iterator.n()).done) {
              _context2.next = 10;
              break;
            }

            a = _step.value;
            _context2.next = 8;
            return (0, _actionhandler.handle)(_objectSpread(_objectSpread({}, a), {}, {
              action: actions[a.action]
            }));

          case 8:
            _context2.next = 4;
            break;

          case 10:
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](2);

            _iterator.e(_context2.t0);

          case 15:
            _context2.prev = 15;

            _iterator.f();

            return _context2.finish(15);

          case 18:
            res.status(200).json({});

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 12, 15, 18]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
authorRouter.get("/authored", function (req, res) {
  var files = _fs["default"].readdirSync("authored");

  var eligible = files.filter(function (f) {
    return f.endsWith(".json");
  }).map(function (f) {
    return f.replace(".json", "");
  });
  res.status(200).json({
    layers: eligible
  });
});
authorRouter.get("/translate", function (req, res) {
  console.log("server - seen a translate request!");
  var name = req.query.name;
  console.log("authored/".concat(name, ".json"));

  var file = _fs["default"].readFileSync("authored/".concat(name, ".json"));

  try {
    var layers = JSON.parse(file);
    var html = (0, _utils.convertToTwine)(name, layers);
    res.status(200).json({
      html: html
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      error: "could not parse file"
    });
  }
});
var lookup = {
  "Daniel": "p226",
  "Fred": "p228",
  "Richard": "p230",
  "Dave": "p231",
  "Robin": "p234",
  "Charlie": "p236",
  "Kate": "p237",
  "Ed": "p239",
  "Geeta": "p240",
  "Paul": "p241",
  "Eleanor": "p243",
  "Molly": "p245",
  "Izzy": "p248",
  "Holly": "p374",
  "Nadia": "p362",
  "Chloe": "p361"
};
authorRouter.get("/render", /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var name, file, layers, results, _layers, _iterator2, _step2, layer, node, _iterator3, _step3, _layer, torender, _node, _iterator4, _step4, line, _line, _name, text, voice, _voice, result;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            name = req.query.name;
            file = _fs["default"].readFileSync("authored/".concat(name, ".json"));
            layers = JSON.parse(file);
            results = (0, _utils.renderSpeech)(layers);
            _layers = [];
            _iterator2 = _createForOfIteratorHelper(results);

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                layer = _step2.value;
                node = layer.node;
                _layers = [].concat((0, _toConsumableArray2["default"])(_layers), [node]);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            if (_layers.length > 0) {
              _fs["default"].writeFileSync("authored/".concat(name, "_rendered.json"), JSON.stringify(_layers, null, 4));
            }

            _iterator3 = _createForOfIteratorHelper(results);
            _context3.prev = 9;

            _iterator3.s();

          case 11:
            if ((_step3 = _iterator3.n()).done) {
              _context3.next = 37;
              break;
            }

            _layer = _step3.value;
            torender = _layer.torender, _node = _layer.node;
            _iterator4 = _createForOfIteratorHelper(torender);
            _context3.prev = 15;

            _iterator4.s();

          case 17:
            if ((_step4 = _iterator4.n()).done) {
              _context3.next = 27;
              break;
            }

            line = _step4.value;
            _line = (0, _slicedToArray2["default"])(line, 3), _name = _line[0], text = _line[1], voice = _line[2];
            _voice = lookup[voice] || "p300";
            _context3.next = 23;
            return _superagent["default"].get('http://localhost:5002/api/generate').query({
              t: text,
              v: _voice,
              n: _name
            });

          case 23:
            result = _context3.sent;
            res.write(text);

          case 25:
            _context3.next = 17;
            break;

          case 27:
            _context3.next = 32;
            break;

          case 29:
            _context3.prev = 29;
            _context3.t0 = _context3["catch"](15);

            _iterator4.e(_context3.t0);

          case 32:
            _context3.prev = 32;

            _iterator4.f();

            return _context3.finish(32);

          case 35:
            _context3.next = 11;
            break;

          case 37:
            _context3.next = 42;
            break;

          case 39:
            _context3.prev = 39;
            _context3.t1 = _context3["catch"](9);

            _iterator3.e(_context3.t1);

          case 42:
            _context3.prev = 42;

            _iterator3.f();

            return _context3.finish(42);

          case 45:
            res.end(); //status(200).json({data:results.map(r=>r.node)});

          case 46:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[9, 39, 42, 45], [15, 29, 32, 35]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
var _default = authorRouter;
exports["default"] = _default;