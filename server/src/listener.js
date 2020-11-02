import mqtt from 'mqtt';
const client  = mqtt.connect('mqtt://127.0.0.1')

const topics = {};

client.on('connect', function () {
  console.log("connected to mqtt!!");
})

client.on('message', (topic, message, pkt)=>{
    console.log("seen message", message.toString());
    (topics[topic] || []).map(cb=>cb(message))
})

export const subscribe = (topic, cb)=>{
    const subscribed = Object.keys(topics).indexOf(topic) != -1;
    if (!subscribed){ 
        client.subscribe(topic);
    }
    topics[topic] = [...topics[topic] || [], cb];
}

export const send = (topic, message)=>{
    client.publish(topic, message);
}
