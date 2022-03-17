const mqtt = require('mqtt');
const {MQTT_IP}  = require("./config.json");

console.log("connecting mqtt to", MQTT_IP);
const client  = mqtt.connect(`mqtt://${MQTT_IP}`);

const topics = {};

client.on('connect', function () {
  console.log("connected to mqtt!!");
})

client.on('message', (topic, message, pkt)=>{
    (topics[topic] || []).map(cb=>cb(message))
})

const mqttlib = {

    subscribe : (topic, cb)=>{
        const subscribed = Object.keys(topics).indexOf(topic) != -1;
        if (!subscribed){ 
            client.subscribe(topic);
        }
        topics[topic] = [...topics[topic] || [], cb];
    },

    send : (topic, message)=>{
        console.log("sending", topic, message);
        try{
            client.publish(topic, message);
        }catch(err){
            console.log(err);
        }
    }
}

exports.mqttlib = mqttlib;
