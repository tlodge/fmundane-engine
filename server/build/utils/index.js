"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceAll = replaceAll;
exports.convertToTwine = convertToTwine;
exports.renderSpeech = renderSpeech;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

var parseSpeech = function parseSpeech(speech) {
  return (speech || []).reduce(function (acc, s) {
    return "".concat(acc, "\n\t[speech]\n\t\t(\"").concat(s.words, "\",\"").concat(s.voice, "\",\"").concat(s.rate, "\",\"").concat(s.delay, "\")\n");
  }, "");
};

var paramToTuple = function paramToTuple() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return JSON.stringify(params); //.replace( /[{]/g,"(").replace(/[}]/g,")");
};

var actionToString = function actionToString(actions) {
  var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\t\t\t';
  return (actions || []).reduce(function (acc, a) {
    return "".concat(acc).concat(sep, "(\"").concat(a.action, "\",\"").concat(a.delay || 0, "\",\"").concat(paramToTuple(a.params), "\",\"").concat(a.method || 'GET', "\")\n");
  }, "");
};

var parseActions = function parseActions(actions) {
  var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\t\t';
  return (actions || []).reduce(function (acc, s) {
    return "".concat(acc, "\n").concat(sep, "[action]\n").concat(actionToString(s, "".concat(sep, "\t")));
  }, "");
};

var parseRule = function parseRule(rule) {
  var actionstr = rule.actions && rule.actions.length > 0 ? "\n\t\t[actions]".concat(parseActions(rule.actions, '\t\t\t')) : "";
  return "\n\t[rule]\n\t\t[[".concat(rule.rule.operand, "|").concat(rule.next, "]]").concat(actionstr);
};

var parseRules = function parseRules(rules) {
  return rules.reduce(function (acc, r) {
    return "".concat(acc).concat(parseRule(r));
  }, "");
};

var parseOnStart = function parseOnStart(onstart) {
  return "".concat(parseSpeech(onstart.speech), "\n").concat(parseActions(onstart.actions, '\t'));
};

var parsePassages = function parsePassages() {
  var passages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return passages.reduce(function (acc, passage, i) {
    var _passage = "[type:".concat(passage.type, "]\n[onstart]\n").concat(parseOnStart(passage.onstart), "\n[rules]\n").concat(parseRules(passage.rules));

    return "".concat(acc, "\n").concat(addSectionHeader(_passage, passage.id, i));
  }, "");
};

var parseStory = function parseStory(story) {
  return parsePassages(story.events);
};

var htmlify = function htmlify(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

var addTwineHeader = function addTwineHeader(str, name) {
  return "<tw-storydata name=\"".concat(name, "\" startnode=\"1\" creator=\"Twine\" creator-version=\"2.4.0-beta2\" format=\"Harlowe\" format-version=\"3.2.3\" ifid=\"B2D98028-16DB-48B4-9F88-01790A7F1750\" options=\"\"tags=\"\" zoom=\"0.6000000000000001\" hidden><style role=\"stylesheet\" id=\"twine-user-stylesheet\" type=\"text/twine-css\"></style><script role=\"script\" id=\"twine-user-script\" type=\"text/twine-javascript\"></script><tw-tag name=\"speech\" color=\"green\"></tw-tag><tw-tag name=\"button\" color=\"blue\"></tw-tag>\n").concat(str, "</tw-storydata>");
};

var addSectionHeader = function addSectionHeader(str, name, i) {
  return "<tw-passagedata pid=\"".concat(i + 1, "\" name=\"").concat(name, "\" tags=\"\" position=\"").concat(i % 2 == 0 ? 700 : i % 3 == 0 ? 900 : 500, ",").concat(100 + i * 160, "\" size=\"100,100\">").concat(htmlify(str), "</tw-passagedata>");
};

var updateOnStartSpeech = function updateOnStartSpeech(id, node) {
  var lookup = [];

  var _node = _objectSpread(_objectSpread({}, node), {}, {
    onstart: {
      //...node.onstart,
      actions: [].concat((0, _toConsumableArray2["default"])(node.onstart.actions || []), [(node.onstart.speech || []).map(function (speech, i) {
        lookup = [].concat((0, _toConsumableArray2["default"])(lookup), [["".concat(id, "/").concat(node.id, "_speech_").concat(i), speech.words, speech.voice]]);
        return {
          action: "soundmedia",
          params: {
            body: {
              media: "".concat(id, "/").concat(node.id, "_speech_").concat(i, ".wav"),
              nowait: false,
              delay: speech.delay || 0
            }
          }
        };
      })])
    }
  });

  return [lookup, _node];
};

var extractlookup = function extractlookup() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var id = arguments.length > 1 ? arguments[1] : undefined;
  var nid = arguments.length > 2 ? arguments[2] : undefined;
  var i = arguments.length > 3 ? arguments[3] : undefined;
  return arr.map(function (s, j) {
    return ["".concat(id, "/").concat(nid, "_action_").concat(i, "_").concat(j), s.words, s.voice];
  });
};

var extractactions = function extractactions() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var id = arguments.length > 1 ? arguments[1] : undefined;
  var nid = arguments.length > 2 ? arguments[2] : undefined;
  var i = arguments.length > 3 ? arguments[3] : undefined;
  return arr.map(function (s, j) {
    return {
      action: "soundmedia",
      params: {
        body: {
          media: "".concat(id, "/").concat(nid, "_action_").concat(i, "_").concat(j, ".wav"),
          nowait: false,
          delay: s.delay || 0,
          voice: s.voice
        }
      }
    };
  });
};

var updateOnStartActions = function updateOnStartActions(id, node) {
  var lookup = [];

  var _node = _objectSpread(_objectSpread({}, node), {}, {
    onstart: _objectSpread(_objectSpread({}, node.onstart || {}), {}, {
      actions: (node.onstart.actions || []).reduce(function (acc, actionarr) {
        return [].concat((0, _toConsumableArray2["default"])(acc), [(actionarr || []).reduce(function (acc1, action, i) {
          if (action.action == "say" || action.action.indexOf("[speech]") !== -1) {
            lookup = [].concat((0, _toConsumableArray2["default"])(lookup), (0, _toConsumableArray2["default"])(extractlookup(action.params.body.speech, id, node.id, i)));
            return [].concat((0, _toConsumableArray2["default"])(acc1), (0, _toConsumableArray2["default"])(extractactions(action.params.body.speech, id, node.id, i)));
          }

          return [].concat((0, _toConsumableArray2["default"])(acc1), [action]);
        }, [])]);
      }, [])
    })
  });

  return [lookup, _node];
};

var updateRules = function updateRules(id, node) {
  var lookup = [];

  var _node = _objectSpread(_objectSpread({}, node), {}, {
    rules: (node.rules || []).map(function (r, rindx) {
      return _objectSpread(_objectSpread({}, r), {}, {
        actions: (r.actions || []).reduce(function (acc, actionarr) {
          return [].concat((0, _toConsumableArray2["default"])(acc), [(actionarr || []).reduce(function (acc1, action) {
            if (action.action == "say" || action.action.indexOf("[speech]") !== -1) {
              lookup = [].concat((0, _toConsumableArray2["default"])(lookup), (0, _toConsumableArray2["default"])(extractlookup(action.params.body.speech, id, node.id, rindx)));
              return [].concat((0, _toConsumableArray2["default"])(acc1), (0, _toConsumableArray2["default"])(extractactions(action.params.body.speech, id, node.id, rindx)));
            }

            return [].concat((0, _toConsumableArray2["default"])(acc1), [action]);
          }, [])]);
        }, [])
      });
    })
  });

  return [lookup, _node];
};

var updateSpeechInNode = function updateSpeechInNode(id, node) {
  var _updateOnStartSpeech = updateOnStartSpeech(id, node),
      _updateOnStartSpeech2 = (0, _slicedToArray2["default"])(_updateOnStartSpeech, 2),
      _t1 = _updateOnStartSpeech2[0],
      _node = _updateOnStartSpeech2[1];

  var _updateOnStartActions = updateOnStartActions(id, _node),
      _updateOnStartActions2 = (0, _slicedToArray2["default"])(_updateOnStartActions, 2),
      _t2 = _updateOnStartActions2[0],
      _node2 = _updateOnStartActions2[1];

  var _updateRules = updateRules(id, _node2),
      _updateRules2 = (0, _slicedToArray2["default"])(_updateRules, 2),
      _t3 = _updateRules2[0],
      _node3 = _updateRules2[1];

  return {
    lookup: [].concat((0, _toConsumableArray2["default"])(_t1), (0, _toConsumableArray2["default"])(_t2), (0, _toConsumableArray2["default"])(_t3)),
    node: _node3
  }; //[_node, lookup]      = updateOnStartAction(node.onstart.actions)
};

var replaceSpeech = function replaceSpeech(story) {
  var lookup = [];
  var nodes = (story.events || []).reduce(function (acc, item) {
    var _updateSpeechInNode = updateSpeechInNode(story.id, item),
        _lookup = _updateSpeechInNode.lookup,
        node = _updateSpeechInNode.node;

    lookup = [].concat((0, _toConsumableArray2["default"])(lookup), (0, _toConsumableArray2["default"])(_lookup));
    return [].concat((0, _toConsumableArray2["default"])(acc), [node]);
  }, []);
  return [lookup, _objectSpread(_objectSpread({}, story), {}, {
    events: nodes
  })];
};

function convertToTwine(name, obj) {
  var _final = "";

  var _iterator = _createForOfIteratorHelper(obj),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var story = _step.value;
      _final = "".concat(_final, "\n                ").concat(addTwineHeader(parseStory(story), story.id));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return _final;
}

function renderSpeech(obj) {
  var results = [];

  var _iterator2 = _createForOfIteratorHelper(obj),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var story = _step2.value;

      var _replaceSpeech = replaceSpeech(story),
          _replaceSpeech2 = (0, _slicedToArray2["default"])(_replaceSpeech, 2),
          torender = _replaceSpeech2[0],
          replaced = _replaceSpeech2[1];

      results = [].concat((0, _toConsumableArray2["default"])(results), [{
        id: story.id,
        torender: torender,
        node: replaced
      }]);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return results;
}