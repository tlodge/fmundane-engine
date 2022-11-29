"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _listener = require("./listener");

var _ws = require("./ws");

var _actions2 = _interopRequireDefault(require("./actions/actions.json"));

var _IPs = _interopRequireDefault(require("./actions/IPs.json"));

var _actionhandler = require("./actionhandler");

var _utils = require("./utils");

var _http = _interopRequireDefault(require("http"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var actions = JSON.parse(Object.keys(_IPs["default"]).reduce(function (acc, key) {
  return (0, _utils.replaceAll)(acc, "[".concat(key, "]"), _IPs["default"][key]);
}, JSON.stringify(_actions2["default"])));

var _fetchrule = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(rule) {
    var _yield$import, evaluate;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Promise.resolve("./rules/".concat(rule, ".js")).then(function (s) {
              return _interopRequireWildcard(require(s));
            });

          case 2:
            _yield$import = _context.sent;
            evaluate = _yield$import.evaluate;
            return _context.abrupt("return", evaluate);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function _fetchrule(_x) {
    return _ref.apply(this, arguments);
  };
}();

var callserially = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(list, cb) {
    var _iterator, _step, a;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _iterator = _createForOfIteratorHelper(list);
            _context2.prev = 1;

            _iterator.s();

          case 3:
            if ((_step = _iterator.n()).done) {
              _context2.next = 9;
              break;
            }

            a = _step.value;
            _context2.next = 7;
            return (0, _actionhandler.handle)(a);

          case 7:
            _context2.next = 3;
            break;

          case 9:
            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](1);

            _iterator.e(_context2.t0);

          case 14:
            _context2.prev = 14;

            _iterator.f();

            return _context2.finish(14);

          case 17:
            cb();

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 11, 14, 17]]);
  }));

  return function callserially(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _executeactions = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(alist) {
    var placeholders,
        parallel,
        _iterator2,
        _step2,
        _loop,
        _args4 = arguments;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            placeholders = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
            parallel = []; //for (const row of alist){
            //  console.log("row is ", row);

            _iterator2 = _createForOfIteratorHelper(alist);

            try {
              _loop = function _loop() {
                var actionlist = _step2.value;

                //swap in any params
                var _alist = actionlist.map(function (a) {
                  var astr = JSON.stringify(a, null, 4);
                  var matches = astr.matchAll(/\|(.*?)\|/g);

                  var _iterator3 = _createForOfIteratorHelper(matches),
                      _step3;

                  try {
                    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                      var match = _step3.value;
                      var toreplace = match[0];
                      var key = match[1].split(":")[0];
                      var replacement = (placeholders[key] || "").split(/\s+/);

                      if (replacement) {
                        var tokens = match[1].split(":");
                        var delimiter = tokens.length > 1 ? " ".concat(tokens[1], " ") : " ";
                        astr = (0, _utils.replaceAll)(astr, toreplace, replacement.join(delimiter));
                      }
                    }
                  } catch (err) {
                    _iterator3.e(err);
                  } finally {
                    _iterator3.f();
                  }

                  return JSON.parse(astr);
                });

                parallel.push({
                  list: _alist,
                  cb: function cb() {
                    (0, _ws.send)("action", _alist.map(function (a) {
                      return a.action;
                    }));
                  }
                }); //send("action", _alist);
              };

              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                _loop();
              } //  }

            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            _context4.next = 6;
            return Promise.all(parallel.map( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(p) {
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return callserially(p.list, p.cb);

                      case 2:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x5) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function _executeactions(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var _executespeech = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(lines) {
    var placeholders,
        _lines,
        _args5 = arguments;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            placeholders = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};

            if (!(placeholders && Object.keys(placeholders).length > 0)) {
              _context5.next = 7;
              break;
            }

            _lines = lines.map(function (l) {
              var matches = l.words.matchAll(/\|(.*?)\|/g);
              var _words = l.words;

              var _iterator4 = _createForOfIteratorHelper(matches),
                  _step4;

              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  var match = _step4.value;
                  var toreplace = match[0];
                  var key = match[1].split(":")[0];
                  var replacement = (placeholders[key] || "").split(/\s+/);

                  if (replacement) {
                    var tokens = match[1].split(":");
                    var delimiter = tokens.length > 1 ? " ".concat(tokens[1], " ") : ",";
                    _words = (0, _utils.replaceAll)(_words, toreplace, replacement.join(delimiter));
                  }
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }

              return _objectSpread(_objectSpread({}, l), {}, {
                words: _words
              });
            });
            _context5.next = 5;
            return (0, _actionhandler.handlespeech)(_lines);

          case 5:
            _context5.next = 9;
            break;

          case 7:
            _context5.next = 9;
            return (0, _actionhandler.handlespeech)(lines);

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function _executespeech(_x6) {
    return _ref5.apply(this, arguments);
  };
}();

var fetchPlaceholders = function fetchPlaceholders() {
  var url = "http://127.0.0.1:3001/placeholders";
  return new Promise(function (resolve, reject) {
    _http["default"].get(url, function (res) {
      var body = "";
      res.on("data", function (chunk) {
        body += chunk;
      });
      res.on("end", function () {
        try {
          var json = JSON.parse(body);
          console.log("nice, have placeholders", json);
          resolve(json);
        } catch (error) {
          console.error(error.message);
          reject({
            error: err.message
          });
        }

        ;
      });
    }).on("error", function (error) {
      console.error(error.message);
      reject({
        error: err.message
      });
    });
  });
};

var StateMachine = function StateMachine(config) {
  var event;
  var _config$events = config.events,
      events = _config$events === void 0 ? [] : _config$events,
      _config$id = config.id,
      id = _config$id === void 0 ? "" : _config$id;
  var placeholders = {};
  fetchPlaceholders().then(function (ph) {
    placeholders = ph;
  });
  var eventlookup = events.reduce(function (acc, item) {
    return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, item.id, item));
  }, {});

  var formataction = function formataction(a) {
    if (actions[a.action]) return actions[a.action];
    var method = a.method || "GET";
    var base = {
      "type": "request",
      "data": {
        "url": a.action,
        "type": method,
        "contenttype": "application/json"
      }
    };

    if (method == "GET") {
      return _objectSpread(_objectSpread({}, base), {}, {
        query: (a.params || {}).query || {}
      });
    } else {
      return _objectSpread(_objectSpread({}, base), {}, {
        body: (a.params || {}).body || {}
      });
    }
  };

  var reset = /*#__PURE__*/function () {
    var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var _event$onstart, _event$onstart$speech, speech, _event$onstart$action, _actions, __startactions;

      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              nexteventid = config.start.event;

              if (!event) {
                _context6.next = 19;
                break;
              }

              if (!event.onstart) {
                _context6.next = 18;
                break;
              }

              _event$onstart = event.onstart, _event$onstart$speech = _event$onstart.speech, speech = _event$onstart$speech === void 0 ? [] : _event$onstart$speech, _event$onstart$action = _event$onstart.actions, _actions = _event$onstart$action === void 0 ? [] : _event$onstart$action;
              _context6.next = 6;
              return fetchPlaceholders();

            case 6:
              placeholders = _context6.sent;
              __startactions = _actions.map(function (arr) {
                return (arr || []).map(function (a) {
                  return _objectSpread(_objectSpread({}, a), {}, {
                    action: formataction(a)
                  });
                });
              });
              _context6.t0 = Promise;
              _context6.next = 11;
              return _executeactions(__startactions);

            case 11:
              _context6.t1 = _context6.sent;
              _context6.next = 14;
              return _executespeech(speech);

            case 14:
              _context6.t2 = _context6.sent;
              _context6.t3 = [_context6.t1, _context6.t2];
              _context6.next = 18;
              return _context6.t0.all.call(_context6.t0, _context6.t3);

            case 18:
              (0, _ws.send)("ready", {
                layer: config.id,
                event: {
                  id: nexteventid,
                  type: event.type
                }
              });

            case 19:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function reset() {
      return _ref6.apply(this, arguments);
    };
  }();

  var _unsubscribe = function _unsubscribe() {
    events.map(function (e) {
      (0, _listener.unsubscribe)(e.subscription, config.id);
      (0, _listener.unsubscribe)("/trigger/".concat(config.id), config.id);
    });
  };

  var init = /*#__PURE__*/function () {
    var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var eventid, _event$onstart2, _event$onstart2$speec, speech, _event$onstart2$actio, _actions, __startactions, updateplaceholders, trigger, sub;

      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              eventid = config.start.event;
              event = eventlookup[eventid];

              if (!event) {
                _context11.next = 18;
                break;
              }

              (0, _ws.send)("event", {
                id: config.id,
                data: event
              });

              if (!event.onstart) {
                _context11.next = 17;
                break;
              }

              _event$onstart2 = event.onstart, _event$onstart2$speec = _event$onstart2.speech, speech = _event$onstart2$speec === void 0 ? [] : _event$onstart2$speec, _event$onstart2$actio = _event$onstart2.actions, _actions = _event$onstart2$actio === void 0 ? [] : _event$onstart2$actio;
              __startactions = _actions.map(function (arr) {
                return (arr || []).map(function (a) {
                  return _objectSpread(_objectSpread({}, a), {}, {
                    action: formataction(a)
                  });
                });
              });
              _context11.t0 = Promise;
              _context11.next = 10;
              return _executeactions(__startactions, placeholders);

            case 10:
              _context11.t1 = _context11.sent;
              _context11.next = 13;
              return _executespeech(speech, placeholders);

            case 13:
              _context11.t2 = _context11.sent;
              _context11.t3 = [_context11.t1, _context11.t2];
              _context11.next = 17;
              return _context11.t0.all.call(_context11.t0, _context11.t3);

            case 17:
              (0, _ws.send)("ready", {
                layer: config.id,
                event: {
                  id: eventid,
                  type: event.type
                }
              });

            case 18:
              //this is a subscripton to manual triggers (either by clicking nodes in the tree or calling webhook /event/trigger);
              (0, _listener.subscribe)("/trigger/".concat(id), id, /*#__PURE__*/function () {
                var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(msg) {
                  var node, layer, triggeredevent;
                  return _regenerator["default"].wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          try {
                            node = msg.node, layer = msg.layer;
                            triggeredevent = eventlookup[node];

                            if (triggeredevent) {
                              (0, _listener.unsubscribe)(event.subscription, layer);
                              (0, _ws.send)("event", {
                                id: config.id,
                                data: triggeredevent
                              });
                              sub(triggeredevent);
                              (0, _ws.send)("ready", {
                                layer: config.id,
                                event: {
                                  id: node,
                                  type: triggeredevent.type
                                }
                              });
                            }
                          } catch (err) {}

                        case 1:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function (_x7) {
                  return _ref8.apply(this, arguments);
                };
              }());

              updateplaceholders = function updateplaceholders(rule, msg) {
                //only assign if rule has triggered
                if (rule.assign) {
                  var _rule$assign = rule.assign,
                      name = _rule$assign.name,
                      _rule$assign$value = _rule$assign.value,
                      value = _rule$assign$value === void 0 ? null : _rule$assign$value;
                  placeholders[name] = value || msg;
                }
              };

              trigger = /*#__PURE__*/function () {
                var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(triggered, e, id, nexteventid, actionids, msg) {
                  var data, _actions, _e, _e$onstart, _e$onstart$speech, _speech, _e$onstart$actions, _sactions, _startactions;

                  return _regenerator["default"].wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          data = msg.data;
                          (0, _listener.unsubscribe)(e.subscription, id);
                          _actions = actionids.map(function (arr) {
                            return (arr || []).map(function (a) {
                              return _objectSpread(_objectSpread({}, a), {}, {
                                action: formataction(a)
                              });
                            });
                          });
                          _context8.next = 5;
                          return _executeactions(_actions, placeholders);

                        case 5:
                          _e = eventlookup[nexteventid];

                          if (!_e) {
                            _context8.next = 23;
                            break;
                          }

                          (0, _ws.send)("event", {
                            id: config.id,
                            data: _e,
                            triggered: triggered
                          });

                          if (!_e.onstart) {
                            _context8.next = 21;
                            break;
                          }

                          _e$onstart = _e.onstart, _e$onstart$speech = _e$onstart.speech, _speech = _e$onstart$speech === void 0 ? [] : _e$onstart$speech, _e$onstart$actions = _e$onstart.actions, _sactions = _e$onstart$actions === void 0 ? [] : _e$onstart$actions;
                          _startactions = _sactions.map(function (arr) {
                            return (arr || []).map(function (a) {
                              return _objectSpread(_objectSpread({}, a), {}, {
                                action: formataction(a)
                              });
                            });
                          });
                          _context8.t0 = Promise;
                          _context8.next = 14;
                          return _executeactions(_startactions, placeholders);

                        case 14:
                          _context8.t1 = _context8.sent;
                          _context8.next = 17;
                          return _executespeech(_speech, placeholders);

                        case 17:
                          _context8.t2 = _context8.sent;
                          _context8.t3 = [_context8.t1, _context8.t2];
                          _context8.next = 21;
                          return _context8.t0.all.call(_context8.t0, _context8.t3);

                        case 21:
                          (0, _ws.send)("ready", {
                            layer: config.id,
                            event: {
                              id: nexteventid,
                              type: _e.type
                            }
                          });
                          sub(_e);

                        case 23:
                        case "end":
                          return _context8.stop();
                      }
                    }
                  }, _callee8);
                }));

                return function trigger(_x8, _x9, _x10, _x11, _x12, _x13) {
                  return _ref9.apply(this, arguments);
                };
              }();

              sub = function sub(e) {
                var nexteventid, triggered, timer;
                event = e;

                if (e.timeout) {
                  timer = setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                    var _e$timeout$rules, rules, _iterator5, _step5, r, subject, type, actionids, evaluate, result, next, _triggered, _actionids;

                    return _regenerator["default"].wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            _e$timeout$rules = e.timeout.rules, rules = _e$timeout$rules === void 0 ? [] : _e$timeout$rules;

                            if (!(rules.length > 0)) {
                              _context9.next = 29;
                              break;
                            }

                            _iterator5 = _createForOfIteratorHelper(rules);
                            _context9.prev = 3;

                            _iterator5.s();

                          case 5:
                            if ((_step5 = _iterator5.n()).done) {
                              _context9.next = 19;
                              break;
                            }

                            r = _step5.value;
                            subject = void 0, type = void 0;
                            actionids = [[]];

                            if (r.rule.subject) {
                              subject = placeholders[r.rule.subject];
                              type = "variable";
                              actionids = (0, _toConsumableArray2["default"])(r.rule.actions || []);
                            }

                            _context9.next = 12;
                            return _fetchrule(type || e.type);

                          case 12:
                            evaluate = _context9.sent;
                            result = evaluate(r.rule.operator, r.rule.operand, subject || "");

                            if (!result) {
                              _context9.next = 17;
                              break;
                            }

                            trigger(e.id, e, e.id, r.next, actionids, JSON.stringify({
                              data: subject || "",
                              ts: Date.now()
                            }));
                            return _context9.abrupt("break", 19);

                          case 17:
                            _context9.next = 5;
                            break;

                          case 19:
                            _context9.next = 24;
                            break;

                          case 21:
                            _context9.prev = 21;
                            _context9.t0 = _context9["catch"](3);

                            _iterator5.e(_context9.t0);

                          case 24:
                            _context9.prev = 24;

                            _iterator5.f();

                            return _context9.finish(24);

                          case 27:
                            _context9.next = 33;
                            break;

                          case 29:
                            next = e.timeout.next;
                            _triggered = e.id;
                            _actionids = (0, _toConsumableArray2["default"])(e.timeout.actions || []);
                            trigger(_triggered, e, e.id, next, _actionids, JSON.stringify({
                              data: "",
                              ts: Date.now()
                            }));

                          case 33:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9, null, [[3, 21, 24, 27]]);
                  })), e.timeout.wait * 1000);
                }

                (0, _listener.subscribe)(e.subscription, id, /*#__PURE__*/function () {
                  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(msg) {
                    var data, ts, evaluate, defaultrule, actionids, result;
                    return _regenerator["default"].wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            console.log("seen a subscription event", e.subscription);
                            triggered = false;
                            data = msg.data, ts = msg.ts;
                            _context10.next = 5;
                            return _fetchrule(e.type);

                          case 5:
                            evaluate = _context10.sent;
                            defaultrule = e.rules.reduce(function (acc, item) {
                              var rule = item.rule;

                              if (rule["default"]) {
                                return item;
                              }

                              return acc;
                            }, null);
                            actionids = e.rules.filter(function (r) {
                              return !r.rule["default"];
                            }).reduce(function (acc, item) {
                              var result = evaluate(item.rule.operator, item.rule.operand, data);

                              if (result) {
                                updateplaceholders(item.rule, data);
                                nexteventid = item.next;
                                triggered = item.id;
                                return [].concat((0, _toConsumableArray2["default"])(acc), (0, _toConsumableArray2["default"])(item.actions));
                              }

                              return acc;
                            }, []); //if nothing else has triggered and there is a default rule...

                            if (!triggered && defaultrule) {
                              result = evaluate(defaultrule.rule.operator, defaultrule.rule.operand, data);

                              if (result) {
                                updateplaceholders(defaultrule.rule, data);
                                nexteventid = defaultrule.next;
                                triggered = defaultrule.id;
                                actionids = (0, _toConsumableArray2["default"])(defaultrule.actions);
                              }
                            }

                            if (triggered) {
                              if (timer) {
                                clearTimeout(timer);
                              }

                              trigger(triggered, e, id, nexteventid, actionids, msg);
                            }

                          case 10:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10);
                  }));

                  return function (_x14) {
                    return _ref11.apply(this, arguments);
                  };
                }());
              };

              sub(event);

            case 23:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function init() {
      return _ref7.apply(this, arguments);
    };
  }();

  return {
    id: id,
    init: init,
    state: function (_state) {
      function state() {
        return _state.apply(this, arguments);
      }

      state.toString = function () {
        return _state.toString();
      };

      return state;
    }(function () {
      return state;
    }),
    reset: reset,
    unsubscribe: _unsubscribe,
    start: config.start
  };
};

var _default = StateMachine;
exports["default"] = _default;