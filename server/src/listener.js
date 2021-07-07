import mqtt from 'mqtt';

console.log("connecting to mqtt!");
const client  = mqtt.connect('mqtt://127.0.0.1')

let topics = {};

client.on('connect', function () {
  console.log("connected to mqtt!!");
})

//EITHER THE TOPIC (IE TOPIC/LAYER) OR THE MESSAGE NEEDS TO SAY WHICH LAYER IT COMES FROM!
client.on('message', (topic, message, pkt)=>{
    
    console.log("OK SEEN MESSAGE", topic, message.toString());

    (topics[topic] || []).map(cb=>cb(message))
})

export const unsubscribe = (topic)=>{
    client.unsubscribe(topic, (err)=>{
      
        topics = Object.keys(topics).reduce((acc, key)=>{
            if (key === topic){
                return acc;
            }
            return {
                ...acc,
                [key]: topics[key],
            }
        },{});
    }); 
}

export const subscribe = (topic,layer, cb)=>{
    const subscribed = Object.keys(topics).indexOf(topic) != -1;
    if (!subscribed){ 
        client.subscribe(topic);
    }
    topics[topic] = [...topics[topic] || [], cb];
}

export const send = (topic, message)=>{
    client.publish(topic, message);
}
