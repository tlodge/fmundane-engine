import mqtt from 'mqtt';

console.log("connecting to mqtt!");
const client  = mqtt.connect('mqtt://127.0.0.1')

let callbacks = {};
//callbacks = {[topic]: [layer] : cb}

client.on('connect', function () {
  console.log("connected to mqtt!!");
})



//EITHER THE TOPIC (IE TOPIC/LAYER) OR THE MESSAGE NEEDS TO SAY WHICH LAYER IT COMES FROM!
client.on('message', (topic, message, pkt)=>{
    Object.keys(callbacks[topic]).map(k=>callbacks[topic][k](k,message));
})

export const unsubscribe = (topic, layer)=>{


    callbacks = Object.keys(callbacks).reduce((acc, _topic)=>{
        if (_topic === topic){
            if (callbacks[_topic][layer]){
                if (Object.keys(callbacks[_topic]).length <= 1){
                    return acc; //get rid of this topic entirely if this is the last layer subscribed to it!
                }
             
                //otherwise just get rid of the layer within the topic
                return {
                    ...acc,
                    [_topic]: Object.keys(callbacks[_topic]).reduce((acc,_layer)=>{
                        if (_layer == layer)
                            return acc;
                        return {
                            ...acc,
                            [_layer] : callbacks[_topic][_layer]
                        }
                    },{})
                }
            }
        }
        return {
            ...acc,
            [_topic]: callbacks[_topic]
        }
    },{});

    //if there are now no layers subscribed to the topic, then remove
    if (!(callbacks[topic])){
        client.unsubscribe(topic, (err)=>{
            console.log("fully unsubscribed from topic", topic);
        }); 
    }
    console.log("**********");
    console.log(callbacks);
    console.log("**********");
}

export const subscribe = (topic,layer, cb)=>{
 
    const subscribed = Object.keys(callbacks).indexOf(topic) != -1;
    
    if (!subscribed){ 
        client.subscribe(topic);
    }

    callbacks = {
        ...callbacks,
        [topic] : {
            ...(callbacks[topic] || {}),
            [layer] : cb
        }
    }
    console.log("**********");
    console.log(callbacks);
    console.log("**********");
}

export const send = (topic, message)=>{
    client.publish(topic, message);
}
