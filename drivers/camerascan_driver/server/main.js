const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('./mqttlib');


const app = express();


let ws;
app.use(express.static("public"));


app.get('/api/scan', (req,res) => {
    console.log("seen scan request");
    const {type=null} = req.query;
    mqtt.send("camera", JSON.stringify({type}));
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
mqtt.subscribe("camera",  (message)=>{
    console.log(message.toString());
    if (ws){
        ws.send(message.toString());
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
