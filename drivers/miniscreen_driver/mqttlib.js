const mqtt = require('mqtt');
const ips = require('../../server/src/actions/IPs.json');
const MQTT_IP = ips.lenovo || "127.0.0.1";
console.log("read IP from ../../server/src/actions/IPs.json (lenovo)", MQTT_IP);
const client  = mqtt.connect(`mqtt://${MQTT_IP}`);

const topics = {};

client.on('connect', function () {
  console.log("connected to mqtt!!");
})

client.on('message', (topic, message, pkt)=>{
    //console.log("seen message", topic, message.toString());
    (topics[topic] || []).map(cb=>cb(message))
})


module.exports = {

    subscribe : (topic, cb)=>{
        const subscribed = Object.keys(topics).indexOf(topic) != -1;
        if (!subscribed){ 
            client.subscribe(topic);
        }
        topics[topic] = [...topics[topic] || [], cb];
    },

    send : (topic, message)=>{
        client.publish(topic, message);
    }
}
