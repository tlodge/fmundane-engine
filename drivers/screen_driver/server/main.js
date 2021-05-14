const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('./mqttlib');


const app = express();


let ws;
app.use(express.static("public"));


app.get('/api/camera/scan', (req,res) => {
    console.log("seen camera scan request");
    const {state=null} = req.query;
    
	if (ws){
        ws.send(JSON.stringify({type:"camera", state}));
    }
    res.status(200).send();
})

app.get('/api/camera', (req,res) => {
    console.log("seen scan request");
    const {type=null} = req.query;
    if (ws){
        ws.send(JSON.stringify({type:"url", url:"/camera"}));
    }
    
	res.status(200).send();
})

app.get('/api/air', (req,res) => {
    console.log("seen air request!");
    if (ws){
        ws.send(JSON.stringify({type:"url", url:"/air"}));
    }
    
    res.status(200).send();
})
//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

/*wss.on('connection', (ws) => {

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => { 
      console.log(message);
    });
});

setInterval(() => {
    wss.clients.forEach((ws) => {
        
        if (!ws.isAlive) return ws.terminate();
        
        ws.isAlive = false;
        ws.ping(null, false, true);
    });
}, 10000);*/


//pass through mqtt events to "camera" to the browser over websocket
//not sure dyson va10 and noxl are correct, though same interpretation as: https://github.com/Grizzelbee/ioBroker.dysonairpurifier
mqtt.subscribe("screen",  (message)=>{
    try{    
        
        const msg = JSON.parse(message);
        console.log(msg);
        if (msg.type === "dyson"){
            if (msg.msg==="ENVIRONMENTAL-CURRENT-SENSOR-DATA"){
                const {p10r="0000", p25r="0000", noxl="0000", va10="0000"} = msg.data;
                const pm10 = Number(p10r);
                const pm25 = Number(p25r);
                const no2  = Math.floor((Number(noxl) / 10));
                const voc  = Math.floor((Number(va10) / 10));

                console.log(pm10,pm25,no2,voc);

                if (ws){
                    ws.send(JSON.stringify({type:"dyson", data: {time:msg.time, pm10, pm25, voc, no2}}));
                }
            }
        }
        else{
            if (ws){
                ws.send(message.toString());
            }
        }
    }catch(err){    
        console.log(err);
    }
});

wss.on('connection', (_ws) => {
    ws = _ws;
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });

    //send immediatly a feedback to the incoming connection    
   
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port}`);
});