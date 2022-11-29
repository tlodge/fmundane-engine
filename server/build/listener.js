"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.send = exports.subscribe = exports.unsubscribe = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _mqtt = _interopRequireDefault(require("mqtt"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

console.log("connecting to mqtt!");

var client = _mqtt["default"].connect('mqtt://127.0.0.1');

var callbacks = {}; //callbacks = {[topic]: [layer] : cb}

client.on('connect', function () {
  console.log("connected to mqtt!!");
}); //client.subscribe("/speech");
//EITHER THE TOPIC (IE TOPIC/LAYER) OR THE MESSAGE NEEDS TO SAY WHICH LAYER IT COMES FROM!

client.on('message', function (topic, message, pkt) {
  console.log("seen message", topic, message.toString());
  var msg = JSON.parse(message.toString());
  console.log("parsed is", msg);

  for (var _i = 0, _Object$keys = Object.keys(callbacks[topic]); _i < _Object$keys.length; _i++) {
    var _layer = _Object$keys[_i];

    //if (_layer==layer){
    callbacks[topic][_layer](msg); //}

  }
});

var unsubscribe = function unsubscribe(topic, layer) {
  if (Object.keys(callbacks || {}).length <= 0) {
    return;
  }

  callbacks = Object.keys(callbacks).reduce(function (acc, _topic) {
    if (_topic === topic) {
      if (callbacks[_topic][layer]) {
        if (Object.keys(callbacks[_topic]).length <= 1) {
          return acc; //get rid of this topic entirely if this is the last layer subscribed to it!
        } //otherwise just get rid of the layer within the topic


        return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, _topic, Object.keys(callbacks[_topic]).reduce(function (acc, _layer) {
          if (_layer == layer) return acc;
          return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, _layer, callbacks[_topic][_layer]));
        }, {})));
      }
    }

    return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, _topic, callbacks[_topic]));
  }, {}); //if there are now no layers subscribed to the topic, then remove

  if (!callbacks[topic]) {
    client.unsubscribe(topic, function (err) {
      console.log("fully unsubscribed from topic", topic);
    });
  }
};

exports.unsubscribe = unsubscribe;

var subscribe = function subscribe(topic, layer, cb) {
  console.log("*** subscribing to *****", topic);
  var subscribed = Object.keys(callbacks).indexOf(topic) != -1;

  if (!subscribed) {
    console.log("Client subscribe", topic);
    client.subscribe(topic);
  }

  callbacks = _objectSpread(_objectSpread({}, callbacks), {}, (0, _defineProperty2["default"])({}, topic, _objectSpread(_objectSpread({}, callbacks[topic] || {}), {}, (0, _defineProperty2["default"])({}, layer, cb))));
};

exports.subscribe = subscribe;

var send = function send(topic) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  console.log("publishing", topic, message);
  client.publish(topic, message);
};

exports.send = send;