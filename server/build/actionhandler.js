"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handle = exports.handlespeech = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _superagent = _interopRequireDefault(require("superagent"));

var _IPs = _interopRequireDefault(require("./actions/IPs.json"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/*
query
{
          "media":"tbu-pos-scifi-insta.mp4",
          "delay":200
}

body
{
           "media":"tbu-pos-scifi-insta.mp4",
           "nowait":true
}
*/
var request = function request(r, delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (r.data.type === "GET") {
        if (r.data.timeout) {
          _superagent["default"].get(r.data.url).query(r.query || {}).timeout({
            response: r.data.timeout
          }).then(function (res) {
            return resolve(res.body);
          })["catch"](function (err) {
            return resolve(err);
          });
        } else {
          _superagent["default"].get(r.data.url).query(r.query || {}).then(function (res) {
            return resolve(res.body);
          })["catch"](function (err) {
            return resolve(err);
          });
        }
      } else if (r.data.type === "POST") {
        if (r.data.timeout) {
          _superagent["default"].post(r.data.url).send(r.body || {}).timeout({
            response: r.data.timeout
          }).then(function (res) {
            return resolve(res.body);
          })["catch"](function (err) {
            return resolve(err);
          });
        } else {
          _superagent["default"].post(r.data.url).send(r.body || {}).then(function (res) {
            return resolve(res.body);
          })["catch"](function (err) {
            return resolve(err);
          });
        }
      }
    }, delay);
  });
};

var handlespeech = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(speech) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!speech || speech.length <= 0)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            _context.next = 4;
            return request({
              "data": {
                "url": "http://".concat(_IPs["default"]["speech"] || "127.0.0.1", ":9105/api/speech"),
                "type": "POST",
                "contenttype": "application/json"
              },
              "body": {
                speech: speech
              }
            });

          case 4:
            return _context.abrupt("return", _context.sent);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handlespeech(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.handlespeech = handlespeech;

var replaceurl = function replaceurl(str) {
  return Object.keys(_IPs["default"]).reduce(function (acc, key) {
    return acc.replace("[".concat(key, "]"), _IPs["default"][key]);
  }, str);
};

var replacequery = function replacequery() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return JSON.parse(Object.keys(_IPs["default"]).reduce(function (acc, key) {
    return acc.replace("[".concat(key, "]"), _IPs["default"][key]);
  }, JSON.stringify(obj)));
};

var handle = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var action, _ref2$delay, delay, _ref2$params, params, _action, __action, response;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            action = _ref2.action, _ref2$delay = _ref2.delay, delay = _ref2$delay === void 0 ? 0 : _ref2$delay, _ref2$params = _ref2.params, params = _ref2$params === void 0 ? {} : _ref2$params;

            if (!(action.type === "request")) {
              _context2.next = 9;
              break;
            }

            _action = Object.keys(params).reduce(function (acc, key) {
              return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, key, params[key]));
            }, action);
            __action = _objectSpread(_objectSpread({}, _action), {}, {
              query: replacequery(_action.query),
              data: _objectSpread(_objectSpread({}, _action.data), {}, {
                url: replaceurl(_action.data.url)
              })
            });
            console.log("HAVE ACTION!", __action);
            _context2.next = 7;
            return request(__action, delay);

          case 7:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 9:
            return _context2.abrupt("return");

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function handle(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.handle = handle;